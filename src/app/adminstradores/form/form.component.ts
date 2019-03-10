import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';


import { FormsModule, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { IAlertConfig } from '@covalent/core/dialogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioDTO, PerfilUsuario } from '../../modelos/UsuarioDTO';
import { UsuarioService } from '../../services/usuario/usuario.service';


@Component({
  selector: 'qs-feature-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
  //viewProviders: [ FeaturesService ],
})
export class AdministradoresFormComponent implements OnInit  {

  //campos para el formulario
  objectoPrincipal= {} as UsuarioDTO;
  desabilitarContrasena:boolean=false;
  hide:boolean = true;

  //accoion
  action: string;
  

  constructor(//private _featuresService: FeaturesService, 
            private _route: ActivatedRoute,
            private _usuarioService: UsuarioService,
            private _loadingService: TdLoadingService,
            private _dialogService: TdDialogService,
            private _snackBarService: MatSnackBar) {}

  goBack(): void {
    window.history.back();
  }

  ngOnInit(): void {

    //por defecto el usuario es habilitado
    this.objectoPrincipal.habilitado = true;

    this._route.url.subscribe((url: any) => {
      this.action = (url.length > 1 ? url[1].path : 'add');
    });
    this._route.params.subscribe((params: {id: string}) => {
      let idDocumento: string = params.id;
      if(idDocumento != null){
        this._loadingService.register();
        this._usuarioService.obtenerUsuario(idDocumento).then((item:UsuarioDTO) => {
          if(item != null){
            //se desabilita el campo contraseña
            this.desabilitarContrasena = true;
            this.objectoPrincipal = item;
          }
          this._loadingService.resolve();
        });
      }
    });
  }

  async save(): Promise<void>  {
    this._loadingService.register();
    
    try {

      //se guarda el perfil del usuario.
      this.objectoPrincipal.perfil = PerfilUsuario._pefil_admin.toString();;
     

      if (this.action === 'add') {
        await this._usuarioService.registrarUsuario(this.objectoPrincipal);
        this.goBack();
      } else {
        if(this.objectoPrincipal.id != null){
          await this._usuarioService.actualizarUsuario(this.objectoPrincipal);
          this.goBack();
        }
      }
      this._snackBarService.open('Registro almacenado', 'Ok',{duration:1000});
    } catch (error) {
      let config:  IAlertConfig ={
        closeButton:"Aceptar",
        message: "Error al guardar el registro.",
      }
      this._dialogService.openAlert(config);
      console.error("error" , error);
    } finally {
      this._loadingService.resolve();
    }
  }
}
