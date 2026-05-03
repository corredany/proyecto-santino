export class Usuario {
  id: number;
  nombre: string;
  email: string;
  contrasena: string;
  rolId: number;
  rolNombre: string;
  permisos: string[];
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: Partial<Usuario>) {
    Object.assign(this, data);
  }
}