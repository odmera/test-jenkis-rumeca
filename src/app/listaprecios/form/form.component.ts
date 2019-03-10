import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { IAlertConfig } from '@covalent/core/dialogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericFirestoreService } from '../../services/genericfirestore/genericfirestore.service';
import { ModeloFirebase } from '../../modelos/ModeloFirebase';
import { ListaPrecio } from '../../modelos/ListaPrecio';
import { Producto } from '../../modelos/Producto';


@Component({
  selector: 'qs-productos-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ListaPreciosFormComponent implements OnInit  {
  
  //campos para el formulario
  objectoPrincipal= {} as ListaPrecio;

  //combo productos
  listTipoProductos:Producto[] =[]
  selectedTipoProducto:string = null;
  
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
    
    //por defecto la LISTAPRECIO es habilitado
    this.objectoPrincipal.habilitado = true;

    this._route.url.subscribe((url: any) => {
      this.action = (url.length > 1 ? url[1].path : 'add');
    });
    this._route.params.subscribe((params: {id: string}) => {
      let idDocumento: string = params.id;
      if(idDocumento != null){
          this._loadingService.register();
          this.__genericFirestoreService.findRecordPropertyFirestore('id',idDocumento,ModeloFirebase.LISTAPRECIO).then((item:ListaPrecio) => {
          if(item != null){
            this.objectoPrincipal = item;
            this.selectedTipoProducto = item.codigoProducto;

            console.log(this.objectoPrincipal);
          }
          this._loadingService.resolve();
        });
      }
    });
  }

  async save(): Promise<void>  {
    this._loadingService.register();
    try {

        //se consulta el producto seleccionado
        let producto:Producto =  await this.__genericFirestoreService.findRecordPropertyFirestore('codigoProducto',this.selectedTipoProducto,ModeloFirebase.PRODUCTO) as Producto;
        if(producto == null){
          let config:  IAlertConfig ={
            closeButton:"Aceptar",
            message: "No se encontro la producto.",
          }
          this._dialogService.openAlert(config);
          return;
        }

        //lleno la producto para el producto
        this.objectoPrincipal.codigoProducto = producto.codigoProducto;
        this.objectoPrincipal.nombreProducto = producto.nombreProducto;
       
        if(this.objectoPrincipal.id != null){
          await this.__genericFirestoreService.updateRecordFirestore(this.objectoPrincipal,ModeloFirebase.LISTAPRECIO);
          this.goBack();
          this._snackBarService.open('Registro almacenado', 'Ok',{duration:1000});
        }
 
    } catch (error) {
      let config:  IAlertConfig ={
        closeButton:"Aceptar",
        message: "Ocurrió guardando el registro.",
      }
      this._dialogService.openAlert(config);
      console.error("error" , error);
    } finally {
      this._loadingService.resolve();
    }
  }

 

}
