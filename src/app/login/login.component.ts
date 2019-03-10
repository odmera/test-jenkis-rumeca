import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

import { TdLoadingService } from '@covalent/core/loading';
import { Observable } from 'rxjs/Observable';
import { TdDialogService } from '@covalent/core/dialogs';
import { AuntenticacionFirebaseService } from '../services/autenticacion/auntenticacion-firebase.service';
import { UsuarioService } from '../services/usuario/usuario.service';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { IAlertConfig } from '@covalent/core/dialogs';

@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  password: string;
  email: string;
  hide: boolean = true;
  emailFormControl: FormControl;

  items: Observable<any[]>;

  constructor(private _router: Router,
    private _loadingService: TdLoadingService,
    private _dialogService: TdDialogService,
    private _auntenticacionFirebaseService: AuntenticacionFirebaseService,
    private _usuarioService: UsuarioService) {

    this.emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);

  }


  login() {
    this._loadingService.register();
    this.iniciarSesionConEmail(this.email, this.password).then(() => {
      this._loadingService.resolve();
    },
      (error) => {
        this._loadingService.resolve();

        let config: IAlertConfig = {
          closeButton: "Cerrar",
          message: error,
          //title:"Notificación importante"
        }
        this._dialogService.openAlert(config);
        console.error(error);
      })

  }

  async iniciarSesionConEmail(correo: string, clave: string): Promise<void> {

    try {
      //se autentica el usuario en firebase con email
      let sesionCorrecta: boolean = await this._auntenticacionFirebaseService.iniciarSesionConEmail(correo, clave);

      if (sesionCorrecta == true) {
        //consulto el usario autenticado para guardar los datos en la sesion.
        let itemUsuario = await this._usuarioService.consultarUsuarioPorEmail(correo).first().toPromise();
        if (itemUsuario == null || itemUsuario.length == 0) {
          throw ("No se encontro el usuario con el correo dado.");
        }

        if (itemUsuario[0].habilitado == false) {
          throw ("Su cuenta a sido inhabilitada.");
        }

        let usuarioLogin = itemUsuario[0];
        console.log(usuarioLogin);
        //guardo los datos en la sesion
        this._auntenticacionFirebaseService.guardarDatosAlmacenamientoLocal(usuarioLogin);

        this._router.navigate(['/principal']);

      }

    } catch (error) {
      throw (error);
    }

  }


}