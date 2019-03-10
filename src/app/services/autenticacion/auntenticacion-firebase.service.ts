import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UsuarioDTO } from '../../modelos/UsuarioDTO';

@Injectable()
export class AuntenticacionFirebaseService {

  constructor(public afAuth: AngularFireAuth) { 
    
  }

  crearUsuarioConEmail(correo: string, contrasena: string): Promise<boolean> {
    let promesa = new Promise<boolean>((resolve, reject) => {

      this.afAuth.auth.createUserWithEmailAndPassword(correo, contrasena)
        .then((respuesta) => {
          resolve(true);
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error["code"];
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            errorMessage = "Contraseña incorrecta";
          }
          else if (errorCode === 'auth/email-already-in-use') {
            errorMessage = 'El correo ya esta en uso.';
          }
          else if (errorCode === 'auth/weak-password') {
            errorMessage = 'La contraseña es muy corta.';
          }
          else {
            errorMessage = 'Error desconocido. ' + errorMessage;
          }
          console.log("error creando registrando usuario firebase" + errorMessage);
          reject(errorMessage)
        })
    });
    return promesa;
  }


  iniciarSesionConEmail(correo: string, contrasena: string): Promise<true> {

    let promesa = new Promise<true>((resolve, reject) => {

      this.afAuth.auth.signInWithEmailAndPassword(correo, contrasena)
        .then(value => {
          console.log('iniciarSesionConEmail bien');
          resolve(true);
        })
        .catch(error => {
          var errorCode = error["code"];
          var errorMessage = error.message;
          if (errorCode === 'auth/invalid-email') {
            errorMessage = "El correo electrónico no es valido";
          }
          else if (errorCode === 'auth/user-disabled') {
            errorMessage = 'El usuario correspondiente al correo electrónico ha sido deshabilitado.';
          }
          else if (errorCode === 'auth/user-not-found') {
            errorMessage = 'No hay usuario con el correo electrónico dado.';
          }
          else if (errorCode === 'auth/wrong-password') {
            errorMessage = 'La contraseña no es válida.';
          }
          else {
            errorMessage = 'Error desconocido. ' + errorMessage;
          }
          reject(errorMessage)
        });
    });
    return promesa;
  }

  cerrarSesion() {
    let promesa = new Promise<true>((resolve, reject) => {
      localStorage.clear();
      this.afAuth.auth.signOut();
      resolve(true);
    });
    return promesa;
  }


 async restrablecerContrasena(correo: string) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(correo);
      return true;
    } catch (error) {
      new error;
    }  
  }

  async guardarDatosAlmacenamientoLocal(usuarioLogin: UsuarioDTO) {
    localStorage.setItem("usuarioSesion", JSON.stringify(usuarioLogin));
  }

}
