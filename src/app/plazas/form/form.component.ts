import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { IAlertConfig } from '@covalent/core/dialogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Plaza } from '../../modelos/Plaza';
import { GenericFirestoreService } from '../../services/genericfirestore/genericfirestore.service';
import { ModeloFirebase } from '../../modelos/ModeloFirebase';


@Component({
  selector: 'qs-plazas-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
  //viewProviders: [ FeaturesService ],
})
export class PlazasFormComponent implements OnInit  {
  
  //campos para el formulario
  objectoPrincipal= {} as Plaza;
  
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
   
    //por defecto la plaza es habilitado
    this.objectoPrincipal.habilitado = true;

    this._route.url.subscribe((url: any) => {
      this.action = (url.length > 1 ? url[1].path : 'add');
    });
    this._route.params.subscribe((params: {id: string}) => {
      let idDocumento: string = params.id;
      if(idDocumento != null){
        this._loadingService.register();
        this.__genericFirestoreService.findRecordPropertyFirestore('id',idDocumento,ModeloFirebase.PLAZA).then((item:Plaza) => {
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
          let dataExistePlaza = await this.__genericFirestoreService.findRecordPropertyFirestore('codigoPlaza',this.objectoPrincipal.codigoPlaza,ModeloFirebase.PLAZA) as Plaza;
          if(dataExistePlaza != null && dataExistePlaza.codigoPlaza != null){
            let config:  IAlertConfig ={
              closeButton:"Aceptar",
              message: "El código de la plaza ya existe.",
            }
            this._dialogService.openAlert(config);
            return;
          }
          await this.__genericFirestoreService.addRecordFirestore(this.objectoPrincipal,ModeloFirebase.PLAZA);
          this.goBack();
        } else {
          if(this.objectoPrincipal.id != null){
            await this.__genericFirestoreService.updateRecordFirestore(this.objectoPrincipal,ModeloFirebase.PLAZA);
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
