export interface Club {
     id?: string;
     nombreCompleto: string;
     tipoClub:string; //01 Conmebol,02 Zona metropolitana(Nacional B),03 Zona interior(Nacional B)
     foto?: string;
     nombreFoto?: string;
     habilitado: boolean;
}

export enum TipoClub {
    _conmebol = <any>'01',
    _zona_metropolitana_b = <any>'02',
    _zona_interior_b = <any>'03',
}
