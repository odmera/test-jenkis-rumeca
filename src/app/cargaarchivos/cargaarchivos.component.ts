import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TdLoadingService } from '@covalent/core/loading';
import { IAlertConfig } from '@covalent/core/dialogs';
import { TdDialogService } from '@covalent/core/dialogs';
import { GenericFirestoreService } from '../services/genericfirestore/genericfirestore.service';
import { ModeloFirebase } from '../modelos/ModeloFirebase';
import { ListaPrecio } from '../modelos/ListaPrecio';
import { Producto } from '../../../../../MOVIL_DEV/rumeca-movil/src/modelo/Producto';
import { Vereda } from '../../../../../MOVIL_DEV/rumeca-movil/src/modelo/Vereda';
import { Establecimiento } from '../../../../../MOVIL_DEV/rumeca-movil/src/modelo/Establecimiento';



@Component({
  selector: 'qs-cargaarchivos',
  templateUrl: './cargaarchivos.component.html',
  styleUrls: ['./cargaarchivos.component.scss'],
})
export class CargaArchivos implements OnInit {


  //constantes
  PRODUCTOS = 1
  LISTAPRECIOS = 2
  VEREDAS = 3
  ESTABLECIMIENTO = 4


  files: File;
  listaPreciosCsv: ListaPrecio[];
  disabled: boolean = false;

  filesProductos: File;
  listaProductosCsv: Producto[];
  disabledProducto: boolean = false;

  filesVeredas: File;
  listaVeredasCsv: Vereda[];
  disableVereda: boolean = false;


  filesEstablecimiento: File;
  listaEstablecimientosCsv: Establecimiento[];
  disableEstablecimiento: boolean = false;

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _snackBarService: MatSnackBar,
              private _genericFirestoreService: GenericFirestoreService,
            private _dialogService: TdDialogService) {

  }

  ngOnInit(): void {
    this._titleService.setTitle('Carga archivos');
  }


  //metodos generales
  async fileToBase64(file:File,operacion:number) {
    this._loadingService.register();
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (readerEvent) => {
      let text = reader.result;
      let items = JSON.parse(this.csvJSON(text));

      if(operacion === this.LISTAPRECIOS){
        this.listaPreciosCsv = items as ListaPrecio[];
      }
      else if(operacion === this.PRODUCTOS){
        this.listaProductosCsv = items as Producto[];
      }
      else if(operacion === this.VEREDAS){
        this.listaVeredasCsv = items as Vereda[];
      }
      else if(operacion === this.ESTABLECIMIENTO){
        this.listaEstablecimientosCsv = items as Establecimiento[];
      }
      this._loadingService.resolve();
    };
  }

  public csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split("|");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split("|");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return JSON.stringify(result);
  }


 ////------------Gestion para subir archivo productos---------///////
 selectEventProductos(file: File): void {
  this.fileToBase64(file,this.PRODUCTOS);
}

async procesarCsvProductos(acum:number=500){
  this._loadingService.register();
  try {
    for (const item of this.listaProductosCsv) {
      if(item.codigoProducto != null && item.codigoProducto.length > 0){
        item.habilitado = true;
        item.id = item.codigoProducto;
      }
      else{
        let config:  IAlertConfig ={
          closeButton:"Aceptar",
          message: "Por favor verifique los datos del archivo plano.",
        }
        this._dialogService.openAlert(config);
        return;
      }
    }

    let listaProductosCsv500: Producto[] = [];
    if(acum == 500){
      listaProductosCsv500 = this.listaProductosCsv.slice(0, acum);
       await this._genericFirestoreService.setRecordFirestoreMultiple(listaProductosCsv500,ModeloFirebase.PRODUCTO);
       this._snackBarService.open('Registros procesados ' + 500, 'Ok',{duration:1000});
       this.procesarCsvProductos(acum + 500)
    }
    else{
      listaProductosCsv500 = this.listaProductosCsv.slice(acum - 500, acum);
       if(listaProductosCsv500 == null || listaProductosCsv500.length == 0){
        this._snackBarService.open('Fin del proceso.', 'Ok',{duration:1000});
        return;
       }
       await this._genericFirestoreService.setRecordFirestoreMultiple(listaProductosCsv500,ModeloFirebase.PRODUCTO);
       this._snackBarService.open('Registros procesados ' + listaProductosCsv500.length, 'Ok',{duration:1000});
       this.procesarCsvProductos(acum + 500); 
    }
  } catch (error) {
    alert(error)
  }
  finally{
    this._loadingService.resolve();
  }
}
////--------Termina gestion para subir archivo Productos ------/////
  

  ////------------Gestion para subir archivo lista precios---------///////
  selectEvent(file: File): void {
    console.log("selectEvent " , file);
    this.fileToBase64(file,this.LISTAPRECIOS);
  }

  async procesarCsv(acum:number=500){
    this._loadingService.register();
    try {

      for (const item of this.listaPreciosCsv) {
        let producto = item.codigoProducto == null ? null : item.codigoProducto.trim();
        let plaza = item.codigoPlaza == null ? null : item.codigoPlaza.trim();
        if(producto != null && plaza != null){
          item.id = producto.concat(plaza);
        }
        else{
          let config:  IAlertConfig ={
            closeButton:"Aceptar",
            message: "Por favor verifique los datos del archivo plano.",
          }
          this._dialogService.openAlert(config);
          return;
        }
      }

      let listaPreciosCsv500: ListaPrecio[] = [];
      if(acum == 500){
         listaPreciosCsv500 = this.listaPreciosCsv.slice(0, acum);
         await this._genericFirestoreService.setRecordFirestoreMultiple(listaPreciosCsv500,ModeloFirebase.LISTAPRECIO);
         this._snackBarService.open('Registros procesados ' + 500, 'Ok',{duration:1000});
         this.procesarCsv(acum + 500);
      }
      else{
         listaPreciosCsv500 = this.listaPreciosCsv.slice(acum - 500, acum);
         if(listaPreciosCsv500 == null || listaPreciosCsv500.length == 0){
          this._snackBarService.open('Fin del proceso.', 'Ok',{duration:1000});
          return;
         }
         await this._genericFirestoreService.setRecordFirestoreMultiple(listaPreciosCsv500,ModeloFirebase.LISTAPRECIO);
         this._snackBarService.open('Registros procesados ' + listaPreciosCsv500.length, 'Ok',{duration:1000});
         console.log("otros" + listaPreciosCsv500.length)
         this.procesarCsv(acum + 500); 
      }
    } catch (error) {
      alert(error)
    }
    finally{
      this._loadingService.resolve();
    }
  }
  ////--------Termina gestion para subir archivo lista precios ------/////



   ////------------Gestion para subir archivo Veredas---------///////
   selectEventVeredas(file: File): void {
    this.fileToBase64(file,this.VEREDAS);
  }

  async procesarCsvVeredas(acum:number=500){
    this._loadingService.register();
    try {
      for (const item of this.listaVeredasCsv) {
        if(item.codigoVereda != null && item.codigoVereda.length > 0){
          item.id = item.codigoVereda;
        }
        else{
          let config:  IAlertConfig ={
            closeButton:"Aceptar",
            message: "Por favor verifique los datos del archivo plano.",
          }
          this._dialogService.openAlert(config);
          return;
        }
      }

      let listaVeredasCsv500: Vereda[] = [];
      if(acum == 500){
        listaVeredasCsv500 = this.listaVeredasCsv.slice(0, acum);
         await this._genericFirestoreService.setRecordFirestoreMultiple(listaVeredasCsv500,ModeloFirebase.VEREDA);
         this._snackBarService.open('Registros procesados ' + 500, 'Ok',{duration:1000});
         this.procesarCsvVeredas(acum + 500);
      }
      else{
        listaVeredasCsv500 = this.listaVeredasCsv.slice(acum - 500, acum);
         if(listaVeredasCsv500 == null || listaVeredasCsv500.length == 0){
          this._snackBarService.open('Fin del proceso.', 'Ok',{duration:1000});
          return;
         }
         await this._genericFirestoreService.setRecordFirestoreMultiple(listaVeredasCsv500,ModeloFirebase.VEREDA);
         this._snackBarService.open('Registros procesados ' + listaVeredasCsv500.length, 'Ok',{duration:1000});
         this.procesarCsvVeredas(acum + 500); 
      }
    } catch (error) {
      alert(error)
    }
    finally{
      this._loadingService.resolve();
    }
  }
  ////--------Termina gestion para subir archivo Veredas ------/////



  ////------------Gestion para subir archivo establecimientos---------///////
  selectEventRestaurante(file: File): void {
    this.fileToBase64(file,this.ESTABLECIMIENTO);
  }

  async procesarCsvRestaurantes(acum:number=500){
    this._loadingService.register();
    try {

      if(this.listaEstablecimientosCsv == null && this.listaEstablecimientosCsv.length == 0){
        let config:  IAlertConfig ={
          closeButton:"Aceptar",
          message: "Por favor seleccione el archivo plano.",
        }
        this._dialogService.openAlert(config);
        return;
      }

      //let cont = 0;
      console.log(this.listaEstablecimientosCsv);
      for (let item of this.listaEstablecimientosCsv) {
        if(item.tipoEstablecimiento == null || item.tipoEstablecimiento.length == 0 || 
           item.direccion == null || item.direccion.length == 0) {
            let config:  IAlertConfig ={
              closeButton:"Aceptar",
              message: "Por favor verifique los datos del archivo plano.",
            }
            this._dialogService.openAlert(config);
            return;
        }
        item.esAlerta = false;
        item.fechaRegistro = this.convertirFechaUnixtime(new Date());
        console.log(item.fechaRegistro);
        item.correo = "Sin correo electronico";
        item.habilitado = true;
        //item.nombreCompleto = cont + item.nombreCompleto;
        //cont++
      }
      

      let listaEstablecimientosCsv500: Establecimiento[] = [];
      if(acum == 500){
        listaEstablecimientosCsv500 = this.listaEstablecimientosCsv.slice(0, acum);
         await this._genericFirestoreService.recordFirestoreMultiple(listaEstablecimientosCsv500,ModeloFirebase.ESTABLECIMIENTO);
         this._snackBarService.open('Registros procesados ' + 500, 'Ok',{duration:1000});
         this.procesarCsvRestaurantes(acum + 500);
      }
      else{
        listaEstablecimientosCsv500 = this.listaEstablecimientosCsv.slice(acum - 500, acum);
         if(listaEstablecimientosCsv500 == null || listaEstablecimientosCsv500.length == 0){
          this._snackBarService.open('Fin del proceso.', 'Ok',{duration:1000});
          return;
         }
         await this._genericFirestoreService.recordFirestoreMultiple(listaEstablecimientosCsv500,ModeloFirebase.ESTABLECIMIENTO);
         this._snackBarService.open('Registros procesados ' + listaEstablecimientosCsv500.length, 'Ok',{duration:1000});
         this.procesarCsvRestaurantes(acum + 500); 
      }
      this.listaEstablecimientosCsv = [];
    } catch (error) {
      alert(error)
    }
    finally{
      this._loadingService.resolve();
    }
  }
   ////--------Termina gestion para subir archivo restaurantes y tiendas ------/////


   public convertirFechaUnixtime(fecha: Date): number {
    return Number(Math.floor(fecha.getTime() / 1000).toString());
  }

}

