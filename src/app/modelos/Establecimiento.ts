import { Producto } from './Producto';
export interface Establecimiento {
     id?: string;
     idUsuario?:string; //puedes ser opcion, esto para las tiendas que se cargaran desde el adminstrador
     nombreCompleto: string; //nombre o razon social
     correo: string;
     tipoEstablecimiento:string;
     codigodepartamento:string;
     nombredepartamento:string;
     codigomunicipio:string;
     nombremunicipio:string;
     direccion:string; //(busqueda de direcciones de Google)
     latitud:number; //(la da Google de acuerdo a dirección seleccionada)
     longitud:number;//(la da Google de acuerdo a dirección seleccionada)
     telefono:string;
     habilitado: boolean;
     fechaRegistro: number;

     
     //para las alertas
     esAlerta?: boolean;
     productos?:Producto[];
}