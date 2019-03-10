import { Injectable } from '@angular/core';
import { AuntenticacionFirebaseService } from '../autenticacion/auntenticacion-firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ModeloFirebase } from '../../modelos/ModeloFirebase';
import { Observable } from 'rxjs/Observable';
import {Md5} from 'ts-md5';
import { Club } from '../../modelos/Club';
import { AlmacenamientoArchivosService } from '../almacenamiento-archivos/almacenamiento-archivos.service';

@Injectable()
export class ClubService {

  collection: AngularFirestoreCollection<Club>;
  
  constructor(public _autenticacionFirebaseService: AuntenticacionFirebaseService,
              public afDB: AngularFirestore,
              public _almacenamientoArchivosService: AlmacenamientoArchivosService) {
              this.collection = this.afDB.collection(`/${ModeloFirebase.CLUBES}`);
  }

  obtenerRef(id) {
    return this.afDB.doc<Club>(`${ModeloFirebase.CLUBES}/${id}`);
  }


  async crear(objecto: Club,imagen:string): Promise<Club> {
    let documento = await this.collection.add(objecto);
    objecto.id = documento.id;
    await this.guardarImagen(objecto,imagen);
    return objecto;
  }

  public async eliminar(id:string) {
    try {
      await this.obtenerRef(id).delete();
    } catch (error) {
      console.log(error);
    }
  }

  async actualizar(objecto: Club,imagen:string) {
    await this.obtenerRef(objecto.id).update(objecto);
    await this.guardarImagen(objecto,imagen)
  }

  public async obtener(id:string): Promise<Club> {
    let documento =  await this.collection.doc(id).ref.get();
     if (documento.exists) {
         return documento.data() as Club;
     } else {
         console.log("No such document!");
     }
 }

 consultarDatos(): Promise<Club[]> {
  return new Promise((resolve, reject) => {
    return this.afDB.collection(ModeloFirebase.CLUBES).
    snapshotChanges().map(actions => {
          return actions.map(a => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() } as Club;
          });
        }).subscribe(datos => {
          resolve(datos)
        });
  });
 }
  /**
   * Consultar club por tipo
   */
  consultarClubPorTipo(tipoClub:string): Promise<Club[]> {
    return new Promise((resolve, reject) => {
      return this.afDB.collection(ModeloFirebase.CLUBES, ref =>
        ref.where('tipoClub', '==', tipoClub)).snapshotChanges().map(actions => {
            return actions.map(a => {
              return { id: a.payload.doc.id, ...a.payload.doc.data() } as Club;
            });
          }).subscribe(datos => {
            resolve(datos)
          });
    });
  }

  async guardarImagen(club: Club,imagenFirebase:string){

    if(imagenFirebase != null) {
      let nombreArchivo:string = club.id;
      let urlFoto: string = await 
                this._almacenamientoArchivosService.guardarFotoFirebase(imagenFirebase, nombreArchivo);

      //se actualiza la foto
      if(urlFoto != null) {
        club.foto = urlFoto;
        club.nombreFoto = nombreArchivo;
        await this.obtenerRef(club.id).update(club);
      } 
    }

  }

}
