import { Injectable } from '@angular/core';
import { AuntenticacionFirebaseService } from '../autenticacion/auntenticacion-firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UsuarioDTO, PerfilUsuario } from '../../modelos/UsuarioDTO';
import { ModeloFirebase } from '../../modelos/ModeloFirebase';
import { Observable } from 'rxjs/Observable';
import {Md5} from 'ts-md5';

@Injectable()
export class UsuarioService {

  collection: AngularFirestoreCollection<UsuarioDTO>;
  
  constructor(public _autenticacionFirebaseService: AuntenticacionFirebaseService,
              public afDB: AngularFirestore) {
  
              this.collection = this.afDB.collection(`/${ModeloFirebase.USUARIOS}`);
  }

  obtenerRef(id) {
    return this.afDB.doc<UsuarioDTO>(`${ModeloFirebase.USUARIOS}/${id}`);
  }

  async registrarUsuario(usuario: UsuarioDTO): Promise<UsuarioDTO> {

    try {
      //se registra el usuario con autenticacion en firebase
      let registroUsuarioCorrecto: boolean =
        await this._autenticacionFirebaseService.crearUsuarioConEmail(usuario.correo, usuario.contrasena);

      if (registroUsuarioCorrecto == true) {
        //se registra el usuario
        let usuarioGuarado = await this.crearUsuario(usuario);
        return usuarioGuarado;
      }

    } catch (err) {
      throw new Error(err);
    }
  }

  async crearUsuario(usuario: UsuarioDTO): Promise<UsuarioDTO> {
    usuario.contrasena= Md5.hashStr(usuario.contrasena).toString();
    console.log(usuario.contrasena);
    //usuario.contrasena = btoa(usuario.contrasena);
    let documento = await this.collection.add(usuario);
    usuario.id = documento.id;
    await this.actualizarUsuario(usuario);
    return usuario;
  }

  public async eliminarUsuario(id:string) {
    try {
      await this.obtenerRef(id).delete();
    } catch (error) {
      console.log(error);
    }
  }

  async actualizarUsuario(usuario: UsuarioDTO) {
    await this.obtenerRef(usuario.id).update(usuario);
  }

  public async obtenerUsuario(id:string): Promise<UsuarioDTO> {
    let documento =  await this.collection.doc(id).ref.get();
     if (documento.exists) {
         return documento.data() as UsuarioDTO;
     } else {
         console.log("No such document!");
     }
 }

  consultarUsuarioPorEmail(correo: string): Observable<UsuarioDTO[]> {
    return this.afDB.collection(`${ModeloFirebase.USUARIOS}`, ref => ref.where('correo', '==', correo)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() } as UsuarioDTO;
      });
    });
  }


  /**
   * Consultar usuario por perfil
   */
  consultarUsuarioPorPerfil(perfil:string): Promise<UsuarioDTO[]> {
    return new Promise((resolve, reject) => {
      return this.afDB.collection(ModeloFirebase.USUARIOS, ref =>
        ref.where('perfil', '==', perfil)).snapshotChanges().map(actions => {
            return actions.map(a => {
              return { id: a.payload.doc.id, ...a.payload.doc.data() } as UsuarioDTO;
            });
          }).subscribe(datos => {
            resolve(datos)
          });
    });
  }

}
