export interface UsuarioDTO {
     id?: string;
     nombreCompleto: string;
     correo: string;
     contrasena: string;
     telefono: string;
     perfil: string; // 01= super admin, 02 usuario(la persona que va los clubes)
     foto?: string;
     nombreFoto?: string;
     habilitado: boolean;
}

export enum PerfilUsuario {
    _pefil_admin = <any>'01',
}
