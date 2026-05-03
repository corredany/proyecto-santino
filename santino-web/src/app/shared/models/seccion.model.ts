export interface Seccion {
  id: number;
  nombre: string;
  descripcionPrincipal: string | null;
  descripcionSeccion: string | null;
  esFija: boolean;
  visible: boolean;
  orden: number;
  creadoPor: number | null;
  actualizadoPor: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearSeccionDto {
  nombre: string;
  descripcionPrincipal?: string;
  descripcionSeccion?: string;
  orden?: number;
}

export interface ActualizarSeccionDto {
  nombre?: string;
  descripcionPrincipal?: string;
  descripcionSeccion?: string;
  visible?: boolean;
  orden?: number;
}
