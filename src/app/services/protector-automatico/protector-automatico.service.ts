import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuntenticacionFirebaseService } from '../autenticacion/auntenticacion-firebase.service';

import { Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate
}  from "@angular/router";

@Injectable()
export class ProtectorAutomaticosService implements CanActivate  {


  constructor(private _router: Router) {
  }

  canActivate(next:ActivatedRouteSnapshot, state: RouterStateSnapshot ){
    let usuarioSesion =  localStorage.getItem("usuarioSesion");
    if(usuarioSesion != null && usuarioSesion.length > 0){
      return true;
    }else{
      this._router.navigate(['/']);
      return false;
    }
  }

}
