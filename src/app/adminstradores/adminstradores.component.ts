import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAlertConfig } from '@covalent/core/dialogs';
import { UsuarioDTO, PerfilUsuario } from '../modelos/UsuarioDTO';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'qs-product-menu',
  templateUrl: './adminstradores.component.html',
  styleUrls: ['./adminstradores.component.scss'],
})
export class AdministradoresComponent implements OnInit {

  listaPrincipal: UsuarioDTO[];
  filtered: UsuarioDTO[];

  constructor(private _titleService: Title,
              private _usuarioService: UsuarioService,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _snackBarService: MatSnackBar,
              private _activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this._titleService.setTitle('Usuarios');
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void>  {
    try {
      this._loadingService.register('listaPrincipal.load');
      //se consulta por separado los dos perfiles ya que 
      //firebase no permite consultar los dos perfiles juntos
      let listaUsuario = await this._usuarioService.consultarUsuarioPorPerfil(PerfilUsuario._pefil_admin.toString());

   
      //se agregan los resultados a la lista de usuarios
      let usuarios:UsuarioDTO[] = [];
      usuarios.push.apply(usuarios, listaUsuario);
   
      this.listaPrincipal=usuarios
      this.filtered = usuarios;
      this._loadingService.resolve('listaPrincipal.load');
    } catch (error) {
      this._loadingService.resolve('listaPrincipal.load');
    }
  }

  filtrarDatos(filtro: string = ''): void {
    if(this.listaPrincipal != null && this.listaPrincipal.length > 0){
      this.filtered = this.listaPrincipal.filter((opcionMenu: UsuarioDTO) => {
        if(opcionMenu.nombreCompleto != null){
          return opcionMenu.nombreCompleto.toLowerCase().indexOf(filtro.toLowerCase()) > -1;
        }
      });
    }
  }


  /**
   * 
   * @param id metodo que permite habilitar o inhabilitar usuarios
   * @param estado 
   */
  async HabilitarUsuario(id: string,estado:boolean):Promise<void> {

    this._loadingService.register('listaPrincipal.load');
    try {

      let usuario =  await this._usuarioService.obtenerUsuario(id);
      if(usuario != null){
        
        usuario.habilitado = estado;
        await this._usuarioService.actualizarUsuario(usuario);

        await this.cargarDatos();
        
        this._snackBarService.open('Registro guardado', 'Ok',{duration:1000});
      }
      
    } catch (error) {
      let config:  IAlertConfig ={
        closeButton:"Aceptar",
        message: "Error al eliminar el registro.",
      }
      this._dialogService.openAlert(config);
      console.error("error" , error);
    } finally {
     this._loadingService.resolve('listaPrincipal.load');
    }
  
  }


  openConfirm(id: string): void {
    this._dialogService.openConfirm({
      message: '¿Esta Seguro?',
      title: 'Confirmación',
      cancelButton: 'No',
      acceptButton: 'Si',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.HabilitarUsuario(id,false);
      } else {
        // DO SOMETHING ELSE
      }
    });
  }

}
