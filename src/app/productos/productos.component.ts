import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAlertConfig } from '@covalent/core/dialogs';

import { TdDataTableService, 
        TdDataTableSortingOrder, 
        ITdDataTableSortChangeEvent, 
        ITdDataTableColumn } from '@covalent/core/data-table';

import { IPageChangeEvent } from '@covalent/core/paging';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../modelos/Categoria';
import { GenericFirestoreService } from '../services/genericfirestore/genericfirestore.service';
import { ModeloFirebase } from '../modelos/ModeloFirebase';
import { Producto } from '../modelos/Producto';


@Component({
  selector: 'qs-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {


  columns: ITdDataTableColumn[] = [
    { name: 'codigoProducto',  label: 'Código producto', filter: true,sortable: true, width: 150 },
    { name: 'nombreProducto',  label: 'Nombre producto', filter: true,sortable: true, width: 300 },
    { name: 'nombreCategoria',  label: 'Categoría', filter: true,sortable: true, width: 300 },
    { name: 'accion', label: '', width:100 },
  ];

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 50;
  sortBy: string = 'codigoProducto';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;


  listaPrincipal: Producto[];
  filteredData: Producto[];
  filteredTotal: number = 0;
  

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _snackBarService: MatSnackBar,
              private _dataTableService: TdDataTableService,
              private _activatedRoute: ActivatedRoute,
              private _genericFirestoreService: GenericFirestoreService) {

  }

  ngOnInit(): void {
    this._titleService.setTitle('Productos');
    this.cargarDatos();
  }


  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    console.log(this.sortBy);
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.listaPrincipal;
    let excludedColumns: string[] = this.columns
    .filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }


  async cargarDatos(): Promise<void> {
    try {
      
      this._loadingService.register('listaPrincipal.load');
      let listaDatos = await this._genericFirestoreService.findRecordFirestore(ModeloFirebase.PRODUCTO);
      this.listaPrincipal=listaDatos
      this.filteredData = listaDatos;
      if(listaDatos != null){
        this.filteredTotal = listaDatos.length;
      }

      this.filter();
      
      this._loadingService.resolve('listaPrincipal.load');
      
    } catch (error) {
      this._loadingService.resolve('listaPrincipal.load');
    }
  }

  async eliminar(id: string):Promise<void> {
    
    this._loadingService.register('listaPrincipal.load');
    try {

      await this._genericFirestoreService.deleteRecord(id,ModeloFirebase.PRODUCTO);

      //se saca el registro de las listas
      this.listaPrincipal = this.listaPrincipal.filter((item: Producto) => {
        return item.id !== id;
      });
      this.filteredData = this.filteredData.filter((item: Producto) => {
        return item.id !== id;
      });

      this._snackBarService.open('Registro eliminado', 'Ok',{duration:1000});
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


  openConfirm(fila: any): void {

    this._dialogService.openConfirm({
      message: '¿Seguro que de eliminar?',
      title: 'Confirmación',
      cancelButton: 'No, Cancelar',
      acceptButton: 'Si, Eliminar',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.eliminar(fila.id);
      } else {
        // DO SOMETHING ELSE
      }
    });
  }
  


}

