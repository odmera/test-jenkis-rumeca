import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

import { LoginComponent } from './login/login.component';
import { AdministradoresFormComponent } from './adminstradores/form/form.component';
import { AdministradoresComponent } from './adminstradores/adminstradores.component';
import { InicioComponent } from './inicio/inicio.component';
import { PrincipalComponent } from './principal/principal.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CategoriasFormComponent } from './categorias/form/form.component';
import { ProductosComponent } from './productos/productos.component';
import { ProductosFormComponent } from './productos/form/form.component';
import { PlazasFormComponent } from './plazas/form/form.component';
import { PlazasComponent } from './plazas/plazas.component';
import { ListaPreciosComponent } from './listaprecios/listaprecios.component';
import { ListaPreciosFormComponent } from './listaprecios/form/form.component';
import { CargaArchivos } from './cargaarchivos/cargaarchivos.component';


const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'principal',
                component: PrincipalComponent,
                //canActivate:[ProtectorAutomaticosService],
                children: [ 
                    {
                        path: '',
                        component: InicioComponent                   
                    },
                    {
                        path: 'inicio',
                        component: InicioComponent                   
                    },
                    {
                        path: 'administradores',
                        children: [
                            {
                                path: '',
                                component: AdministradoresComponent
                            },
                            {
                                path: 'add',
                                component: AdministradoresFormComponent
                            },
                            {
                                path: ':id/delete',
                                component: AdministradoresFormComponent
                            },
                            {
                                path: ':id/edit',
                                component: AdministradoresFormComponent
                            },
                        ]
                    },
                    {
                        path: 'categorias',
                        children: [
                            {
                                path: '',
                                component: CategoriasComponent
                            },
                            {
                                path: 'add',
                                component: CategoriasFormComponent
                            },
                            {
                                path: ':id/delete',
                                component: CategoriasFormComponent
                            },
                            {
                                path: ':id/edit',
                                component: CategoriasFormComponent
                            },
                        ]
                    },
                    {
                        path: 'productos',
                        children: [
                            {
                                path: '',
                                component: ProductosComponent
                            },
                            {
                                path: 'add',
                                component: ProductosFormComponent
                            },
                            {
                                path: ':id/delete',
                                component: ProductosFormComponent
                            },
                            {
                                path: ':id/edit',
                                component: ProductosFormComponent
                            },
                        ]
                    },
                    {
                        path: 'plazas',
                        children: [
                            {
                                path: '',
                                component: PlazasComponent
                            },
                            {
                                path: 'add',
                                component: PlazasFormComponent
                            },
                            {
                                path: ':id/delete',
                                component: PlazasFormComponent
                            },
                            {
                                path: ':id/edit',
                                component: PlazasFormComponent
                            },
                        ]
                    },

                    {
                        path: 'precios',
                        children: [
                            {
                                path: '',
                                component: ListaPreciosComponent
                            },
                            {
                                path: 'add',
                                component: ListaPreciosFormComponent
                            },
                            {
                                path: ':id/delete',
                                component: ListaPreciosFormComponent
                            },
                            {
                                path: ':id/edit',
                                component: ListaPreciosFormComponent
                            },
                        ]
                    },
                    {
                        path: 'cargaarchivos',
                        children: [
                            {
                                path: '',
                                component: CargaArchivos
                            },
                        ]
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule { }
export const routedComponents: any[] = [
    MainComponent, LoginComponent,
    PrincipalComponent,
    InicioComponent,
    AdministradoresComponent,AdministradoresFormComponent,
    CategoriasComponent,CategoriasFormComponent,
    ProductosComponent,ProductosFormComponent,
    PlazasComponent,PlazasFormComponent,
    ListaPreciosComponent,ListaPreciosFormComponent,
    CargaArchivos
];
