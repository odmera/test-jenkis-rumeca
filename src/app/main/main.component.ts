import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuntenticacionFirebaseService } from '../services/autenticacion/auntenticacion-firebase.service';
import { UsuarioDTO, PerfilUsuario } from '../modelos/UsuarioDTO';



@Component({
  selector: 'qs-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  public usuarioSesion: UsuarioDTO;

  rutas: Object[] = [
    {
      nombre: 'Gestion RUMECA',
      ruta: 'inicio',
      icono: 'home',
    },
  ]
 
  constructor(private _router: Router,
              private _auntenticacionFirebaseService: AuntenticacionFirebaseService,
              private _elementRef : ElementRef) {

  }

  ngOnInit(): void {
    let usuario: string = localStorage.getItem('usuarioSesion');
    this.usuarioSesion = JSON.parse(usuario);
  }

  logout(): void {
    this._auntenticacionFirebaseService.cerrarSesion().then((respuesta: boolean)  => {
      if (respuesta === true) {
        this._router.navigate(['/']);
      }
    });
  }

  irOpcion(item):void{
    this._router.navigate(["principal/" + item.ruta]);
  }



  
}
