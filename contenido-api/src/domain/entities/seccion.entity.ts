//Entidad
export class Seccion {
  id: number;
  nombre: string;
  descripcionPrincipal: string | null;
  descripcionSeccion: string | null;
  esFija: boolean;
  visible: boolean;
  orden: number;
  creadoPor: number | null;
  actualizadoPor: number | null;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: Partial<Seccion>) {
    Object.assign(this, data);
  }

  // Reglas de negocio
  puedeEliminarse(): boolean {
    return !this.esFija;
  }

  puedeOcultarse(): boolean {
    return true;
  }
}