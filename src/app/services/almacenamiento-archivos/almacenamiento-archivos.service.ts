import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AlmacenamientoArchivosService {

  private CARPETA_IMAGENES: string = "Imagenes";

  constructor() {
  }

  guardarFotoFirebase(imagenFirebase: string, nombreArchivo: string): Promise<string> {

    console.log("nombre archiv" + nombreArchivo)
    let promesa = new Promise<string>((resolve, reject) => {

      if (imagenFirebase == undefined || imagenFirebase == null || imagenFirebase == '') {
        resolve(null);
        return promesa;
      }
      console.log("Inicio de carga imagen");
      let storageRef = firebase.storage().ref();
      let uploadTask: firebase.storage.UploadTask = storageRef.child(`${this.CARPETA_IMAGENES}/${nombreArchivo}`)
        .putString(imagenFirebase, 'base64', { contentType: 'image/jpeg' });

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => { }, // saber el avance del archivo
        (error) => {  // Manejo de errores

          var errorCode = error['code_'];
          var mensajeError = error['message_'];
          switch (errorCode) {
            case 'storage/invalid-argument':
              mensajeError = "Imagen invalida, no se fue posible guardar la imagen";
              break;
            case 'storage/unauthorized':
              mensajeError = "El usuario no tiene permiso, no se fue posible guardar la imagen";
              break;
            case 'storage/canceled':
              mensajeError = "El usuario canceló la subida de la imagen";
              break;
            case 'storage/unknown':
              mensajeError = "Error desconocido subiendo la imagen";
              break;
          }
          console.log("Errr gradando imagen ", mensajeError)
          reject(mensajeError);
        }, () => { // Termino el proceso
          let url: string = uploadTask.snapshot.downloadURL;
          resolve(url);
        }
      )
    });
    return promesa;
  }

}
