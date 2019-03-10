import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore} from 'angularfire2/firestore';
import { ListaPrecio } from '../../modelos/ListaPrecio';

@Injectable()
export class GenericFirestoreService {

  constructor(private afDB: AngularFirestore) {
  }

  private obtenerRef(id,objectDbName){
    return this.afDB.doc<any>(`${objectDbName}/${id}`);
  }

  /**
   * permite guarda un documento, luego se actualizada con el id generado por firebase
   * @param item
   * @param objectDbName 
   */
  async addRecordFirestore(item:any,objectDbName:string): Promise<string> {
    try {
       let collection:AngularFirestoreCollection<any> = this.afDB.collection(`/${objectDbName}`);
       let document = await collection.add(item);
       item.id = document.id;
       await this.updateRecordFirestore(item,objectDbName);
       return item.id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateRecordFirestore(item:any,objectDbName:string): Promise<string> {
    try {
      let refCriterio = this.afDB.doc(`${objectDbName}/${item.id}`);
      await refCriterio.update(item);
      return item.id;
    } catch (error) {
      throw new Error(error);
    }
  }


  /**
   * permite guarda un documento si no existe lo crea si existe lo modifica
   * @param item
   * @param objectDbName 
   */
  async setRecordFirestore(item:any,objectDbName:string): Promise<void> {
    try {
       let collection:AngularFirestoreCollection<any> = this.afDB.collection(`/${objectDbName}`);
       await collection.doc(item.id).set(item);
    } catch (error) {
      throw new Error(error);
    }
  }


  async addOrUpdateRecordFirestore(item:any,objectDbName:string): Promise<string> {
    try {
      let id:string = null;
      if (item.id == null) { //se guarda
        id = await this.addRecordFirestore(item,objectDbName);
      }
      else { //se actualiza
        id = await this.updateRecordFirestore(item,objectDbName);
      }
      return id;
    } catch (error) {
      throw new Error(error);
    }
  }


  public async deleteRecord(id:string,objectDbName:string) {
    try {
      await this.obtenerRef(id,objectDbName).delete();
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * metodo que permite consultar todos los datos de una "tabla"
   * @param objectDbName 
   */
  findRecordFirestore(objectDbName:string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      return this.afDB.collection(`${objectDbName}`).snapshotChanges().map(actions => {
          return actions.map(a => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() } as any;
          });
        }).subscribe(datos => {
          resolve(datos)
        });
    });
  }

 /**
   * metodo que permite consultar un documento por id
   * @param id 
   * @param objectDbName 
   */
  findRecordPropertyFirestore(campo:string,valor: any,objectDbName:string): Promise<any> {

    return new Promise((resolve, reject) => {
      return this.afDB.collection(objectDbName, ref =>
      
        ref.where(campo, '==', valor)).snapshotChanges().map(actions => {
          return actions.map(a => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() } as any;
          });
        }).subscribe(datos => {
          if(datos != null && datos.length > 0){
            resolve(datos[0])
          }
          else{
            resolve(null);
          }
        });
    });
  }

  /**
   * 
   * @param campo 
   * @param valor 
   * @param objectDbName 
   */
  findRecordPropertyFirestoreList(campo:string,valor: any,objectDbName:string): Promise<any> {
    
    return new Promise((resolve, reject) => {
      return this.afDB.collection(objectDbName, ref =>
      
        ref.where(campo, '==', valor)).snapshotChanges().map(actions => {
          return actions.map(a => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() } as any;
          });
        }).subscribe(datos => {
          if(datos != null && datos.length > 0){
            resolve(datos)
          }
          else{
            resolve(null);
          }
        });
    });
  }

  /**
   * metodo que permite encontrar los registros que han cambiados despuesta de la ultima sincronizacion
   * @param dateLastSync  --> fecha de la ultima sincronizacion.
   * @param objectDbName 
   */
  findRecordLastSync(dateLastSync:number,objectDbName:string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      return this.afDB.collection(objectDbName, ref =>
        ref.where('fecha', '>=',dateLastSync)).snapshotChanges().map(actions => {
          return actions.map(a => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() } as any;
          });
        }).subscribe(datos => {
          resolve(datos)
        });
    });
  }


  /**
   *  permite guarda multiples documentos uno a uno
   * @param items
   * @param objectDbName 
   */
  async recordFirestoreMultiple(items:any[],objectDbName:string){

     //referecias de la bd
    let db = this.afDB.firestore;
    try {
     for (let item of items) {
       if(item.id == null){
          let collectionTransaccion = db.collection(`/${objectDbName}`);
          let documento = await collectionTransaccion.add(item);
          item.id= documento.id;
         }
      }
     return true;
    } catch (error) {
      alert(`metodo recordFirestoreMultiple ${objectDbName} error: ${error}`);
      throw new Error();
    }
  }

  /**
   *  permite guarda multiples documentos
   * @param items
   * @param objectDbName 
   */
  async setRecordFirestoreMultiple(items:any[],objectDbName:string){

    //referecias de la bd
    let db = this.afDB.firestore;
    let batch =db.batch()
   try {
    for (let item of items) {
      let docRef = db.collection(`/${objectDbName}`).doc(item.id);
      batch.set(docRef, item);
    }

    //commit
    await batch.commit();
    return true;

   } catch (error) {
     alert(`metodo updateRecordFirestoreMultiple ${objectDbName} error: ${error}`);
     throw new Error(error);
   }
}


  public findRecordPropertyFirestoreLimit(campo:string,valor:any, limit:number,objectDbName:string): Promise<any[]>{
      return new Promise((resolve, reject) => {
        return this.afDB.collection(objectDbName, ref => {
          return ref
            .where(campo, '==', valor)
            .limit(limit);
        }).snapshotChanges().map(actions => {
          return actions.map(a => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() } as any;
          });
        }).subscribe(datos => {
          resolve(datos)
      });
    });
  }


 /******************************************* metodo especificos  ****************************************/


 /*************************************Termina metodo especificos ****************************************/
}

