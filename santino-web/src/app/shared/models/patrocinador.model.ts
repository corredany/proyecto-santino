export interface Patrocinador {
  id: number;
  nombre: string;
  url: string;
  rutaArchivo: string;
  orden: number;
  creadoPor: number | null;
  actualizadoPor: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearPatrocinadorDto {
  nombre: string;
  url: string;
  orden?: number;
}
