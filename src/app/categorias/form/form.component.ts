import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { IAlertConfig } from '@covalent/core/dialogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from '../../modelos/Categoria';
import { GenericFirestoreService } from '../../services/genericfirestore/genericfirestore.service';
import { ModeloFirebase } from '../../modelos/ModeloFirebase';


@Component({
  selector: 'qs-categorias-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
  //viewProviders: [ FeaturesService ],
})
export class CategoriasFormComponent implements OnInit  {
  
  //campos para el formulario
  objectoPrincipal= {} as Categoria;
  
  //accion
  action: string;

  constructor(
            private _route: ActivatedRoute,
            private _loadingService: TdLoadingService,
            private _dialogService: TdDialogService,
            private _snackBarService: MatSnackBar,
            private __genericFirestoreService: GenericFirestoreService) {
  }

  goBack(): void {
    window.history.back();
  }

  ngOnInit(): void {
   
    //por defecto la categoria es habilitado
    this.objectoPrincipal.habilitado = true;

    this._route.url.subscribe((url: any) => {
      this.action = (url.length > 1 ? url[1].path : 'add');
    });
    this._route.params.subscribe((params: {id: string}) => {
      let idDocumento: string = params.id;
      if(idDocumento != null){
        this._loadingService.register();
        this.__genericFirestoreService.findRecordPropertyFirestore('id',idDocumento,ModeloFirebase.CATEGORIA).then((item:Categoria) => {
          if(item != null){
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

        if (this.action === 'add') {
          let dataExisteCategoria = await this.__genericFirestoreService.findRecordPropertyFirestore('codigoCategoria',this.objectoPrincipal.codigoCategoria,ModeloFirebase.CATEGORIA) as Categoria;
          if(dataExisteCategoria != null && dataExisteCategoria.codigoCategoria != null){
            let config:  IAlertConfig ={
              closeButton:"Aceptar",
              message: "El código de la categoría ya existe.",
            }
            this._dialogService.openAlert(config);
            return;
          }
          await this.__genericFirestoreService.addRecordFirestore(this.objectoPrincipal,ModeloFirebase.CATEGORIA);
          this.goBack();
        } else {
          if(this.objectoPrincipal.id != null){
            await this.__genericFirestoreService.updateRecordFirestore(this.objectoPrincipal,ModeloFirebase.CATEGORIA);
            this.goBack();
          }
        }
        this._snackBarService.open('Registro almacenado', 'Ok',{duration:1000});
 
    } catch (error) {
      let config:  IAlertConfig ={
        closeButton:"Aceptar",
        message: "Ocurrió guardando el registro..",
      }
      this._dialogService.openAlert(config);
      console.error("error" , error);
    } finally {
      this._loadingService.resolve();
    }
  }
}
