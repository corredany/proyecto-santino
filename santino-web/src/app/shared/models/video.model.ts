export interface Video {
  id: number;
  url: string;
  rutaArchivo: string;
  orden: number;
  seccionId: number | null;
  creadoPor: number | null;
  actualizadoPor: number | null;
  creadoEn: string;
  actualizadoEn: string;
}
