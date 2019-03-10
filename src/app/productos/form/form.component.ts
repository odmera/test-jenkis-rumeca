import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { IAlertConfig } from '@covalent/core/dialogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericFirestoreService } from '../../services/genericfirestore/genericfirestore.service';
import { ModeloFirebase } from '../../modelos/ModeloFirebase';
import { Producto } from '../../modelos/Producto';
import { Categoria } from '../../modelos/Categoria';


@Component({
  selector: 'qs-productos-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ProductosFormComponent implements OnInit  {
  
  //campos para el formulario
  objectoPrincipal= {} as Producto;

  //combo categorias
  listTipoCategorias:Categoria[] =[]
  selectedTipoCategoria:string = null;
  
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

    this.consultarTiposCategorias();
   
    //por defecto la PRODUCTO es habilitado
    this.objectoPrincipal.habilitado = true;

    this._route.url.subscribe((url: any) => {
      this.action = (url.length > 1 ? url[1].path : 'add');
    });
    this._route.params.subscribe((params: {id: string}) => {
      let idDocumento: string = params.id;
      if(idDocumento != null){
        this._loadingService.register();
        this.__genericFirestoreService.findRecordPropertyFirestore('id',idDocumento,ModeloFirebase.PRODUCTO).then((item:Producto) => {
          if(item != null){
            this.objectoPrincipal = item;
            this.selectedTipoCategoria = item.codigoCategoria;
          }
          this._loadingService.resolve();
        });
      }
    });
  }

  async save(): Promise<void>  {
    this._loadingService.register();
    try {

        //se consulta la catgoria seleccionada para el producto
        let categoria:Categoria =  await this.__genericFirestoreService.findRecordPropertyFirestore('codigoCategoria',this.selectedTipoCategoria,ModeloFirebase.CATEGORIA) as Categoria;
        if(categoria == null){
          let config:  IAlertConfig ={
            closeButton:"Aceptar",
            message: "No se encontro la categoría.",
          }
          this._dialogService.openAlert(config);
          return;
        }

        //lleno la categoria para el producto
        this.objectoPrincipal.codigoCategoria = categoria.codigoCategoria;
        this.objectoPrincipal.nombreCategoria = categoria.nombreCategoria;

        if (this.action === 'add') {

          let dataExisteProducto = await this.__genericFirestoreService.findRecordPropertyFirestore('codigoProducto',this.objectoPrincipal.codigoProducto,ModeloFirebase.PRODUCTO) as Producto;
          if(dataExisteProducto != null && dataExisteProducto.codigoCategoria != null){
            let config:  IAlertConfig ={
              closeButton:"Aceptar",
              message: "El código del producto ya existe.",
            }
            this._dialogService.openAlert(config);
            return;
          }
          this.objectoPrincipal.id = this.objectoPrincipal.codigoProducto;
          await this.__genericFirestoreService.setRecordFirestore(this.objectoPrincipal,ModeloFirebase.PRODUCTO);
          this.goBack();
        } else {
          if(this.objectoPrincipal.id != null){
            await this.__genericFirestoreService.updateRecordFirestore(this.objectoPrincipal,ModeloFirebase.PRODUCTO);
            this.goBack();
          }
        }
        this._snackBarService.open('Registro almacenado', 'Ok',{duration:1000});
 
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

  /******************************* metodo combo  ************+*********************************************/
  async consultarTiposCategorias(): Promise<void>  {
    let listCategorias =  await this.__genericFirestoreService.findRecordFirestore(ModeloFirebase.CATEGORIA) as Categoria[];
    if(listCategorias != null && listCategorias.length > 0){
      for (let itemCategoria of listCategorias) {
        if(itemCategoria.habilitado === true){
          this.listTipoCategorias.push(itemCategoria);
        }
      }
    }
    //se ordenan las categorias por codigo
    if(this.listTipoCategorias != null && this.listTipoCategorias.length > 0){
       this.listTipoCategorias.sort(function(a,b) {return (a.codigoCategoria > b.codigoCategoria) ? 1 : ((b.codigoCategoria > a.codigoCategoria) ? -1 : 0);} );
    }
  }

  onChangeTipoCategoria(nuevoTipoCategoria) {
    this.selectedTipoCategoria = nuevoTipoCategoria;
    console.log("nuevoTipoCategoria" , nuevoTipoCategoria)
  }

  /*********************************** termina metodos combo  *********************************************/


}
