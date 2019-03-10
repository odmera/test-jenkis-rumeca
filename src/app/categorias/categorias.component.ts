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


@Component({
  selector: 'qs-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {


  columns: ITdDataTableColumn[] = [
    { name: 'codigoCategoria',  label: 'Código categoría', filter: true,sortable: true, width: 260 },
    { name: 'nombreCategoria',  label: 'Nombre categoría', filter: true,sortable: true, width: 500 },
    { name: 'accion', label: '', width:100 },
  ];

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 50;
  sortBy: string = 'codigoCategoria';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;


  listaPrincipal: Categoria[];
  filteredData: Categoria[];
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
    this._titleService.setTitle('Categorias');
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
      let listaDatos = await this._genericFirestoreService.findRecordFirestore(ModeloFirebase.CATEGORIA);
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

      console.log(id);

      //consulta la categoria para poderla eliminar 
      let categoria = await this._genericFirestoreService.findRecordPropertyFirestore('id',id,ModeloFirebase.CATEGORIA) as Categoria;
      if(categoria != null && categoria.id){

        //se valida si hay productos asociados a la categoria 
        let dataHayProducotos =  await this._genericFirestoreService.findRecordPropertyFirestoreLimit('codigoCategoria',categoria.codigoCategoria,1,ModeloFirebase.PRODUCTO);
        if(dataHayProducotos != null && dataHayProducotos.length >0){
          let config:  IAlertConfig ={
            closeButton:"Aceptar",
            title:"No es posible eliminar la categoría",
            message: "Hay productos asociados a esta categoría.",
          }
          this._dialogService.openAlert(config);
          return;
        }

        await this._genericFirestoreService.deleteRecord(categoria.id,ModeloFirebase.CATEGORIA);
        //se saca el registro de las listas
        this.listaPrincipal = this.listaPrincipal.filter((item: Categoria) => {
          return item.id !== categoria.id;
        });
        this.filteredData = this.filteredData.filter((item: Categoria) => {
          return item.id !== categoria.id;
        });

        this._snackBarService.open('Registro eliminado', 'Ok',{duration:1000});

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

