export interface Material {
  id: number;
  url: string;
  rutaArchivo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  seccionId: number | null;
  creadoPor: number | null;
  actualizadoPor: number | null;
  creadoEn: string;
  actualizadoEn: string;
}
