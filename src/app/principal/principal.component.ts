import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { TdMediaService } from '@covalent/core/media';
import { UsuarioDTO } from '../modelos/UsuarioDTO';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'qs-gestion-flotas',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {
  
  
  year = "2018"

  title: string;
  rutas: Object[] = [
    {
      nombre: 'Inicio',
      ruta: 'inicio',
      icono: 'home',
    },
    {
      nombre: 'Usuarios',
      ruta: 'administradores',
      icono: 'supervisor_account',
    },
    {
      nombre: 'Categorías',
      ruta: 'categorias',
      icono: 'assignment',
    },
    {
      nombre: 'Productos',
      ruta: 'productos',
      icono: 'shopping_basket',
    },
    {
      nombre: 'Plazas de mercado',
      ruta: 'plazas',
      icono: 'wc',
    },
    {
      nombre: 'Lista de precios',
      ruta: 'precios',
      icono: 'list',
    },
    {
      nombre: 'Carga de archivos planos',
      ruta: 'cargaarchivos',
      icono: 'cloud_upload',
    },
    /*{
      nombre: 'Prueba',
      ruta: 'clubes',
      icono: 'assignment',
    },*/
  ]

  constructor(private _titService: Title,
    public media: TdMediaService) { }

  ngOnInit(): void {
    this._titService.setTitle('Principal');
    this.title = this._titService.getTitle();
  }

}
