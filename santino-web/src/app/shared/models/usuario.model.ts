export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rolId: number;
  rol: { id: number; nombre: string };
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearUsuarioDto {
  nombre: string;
  email: string;
  contrasena: string;
  rolId: number;
}

export interface ActualizarUsuarioDto {
  nombre?: string;
  email?: string;
  rolId?: number;
}
