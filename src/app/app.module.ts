import { NgModule, Type, } from '@angular/core';
import { BrowserModule, Title }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';

import { AppComponent } from './app.component';
import { RequestInterceptor } from '../config/interceptors/request.interceptor';
import { MOCK_API } from '../config/api.config';

import { routedComponents, AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { CovalentFileModule } from '@covalent/core/file';



const httpInterceptorProviders: Type<any>[] = [
  RequestInterceptor,
];

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AuntenticacionFirebaseService } from './services/autenticacion/auntenticacion-firebase.service';
import { UsuarioService } from './services/usuario/usuario.service';
import { AlmacenamientoArchivosService } from './services/almacenamiento-archivos/almacenamiento-archivos.service';

import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';


import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ProtectorAutomaticosService } from './services/protector-automatico/protector-automatico.service';
import { ClubService } from './services/club/club.service';
import { GenericFirestoreService } from './services/genericfirestore/genericfirestore.service';

export function getAPI(): string {
  return MOCK_API;
}

@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CovalentHttpModule.forRoot({
      interceptors: [{
        interceptor: RequestInterceptor, paths: ['**'],
      }],
    }),
    CovalentHighlightModule,
    CovalentMarkdownModule,
    CovalentFileModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // importa firebase / firerestore, solo es necesario para las características de la base de datos
    AngularFireAuthModule, // importa firebase / auth, solo es necesario para las funciones de autenticación,
    AngularFireStorageModule,  // importa firebase / storage solo es necesario para las funciones de almacenamiento,
    
    TreeTableModule, //tree table primeng
    CheckboxModule,
    FieldsetModule
    
  ], // modules needed to run this module
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    httpInterceptorProviders,
    AuntenticacionFirebaseService,
    ProtectorAutomaticosService,
    UsuarioService,
    AlmacenamientoArchivosService,
    ClubService,
    GenericFirestoreService
    
  ], // additional providers needed for this module
  entryComponents: [ ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
