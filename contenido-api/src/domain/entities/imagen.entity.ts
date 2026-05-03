export class Imagen {
  id: number;
  url: string;
  rutaArchivo: string;
  orden: number;
  seccionId: number | null;
  creadoPor: number | null;
  actualizadoPor: number | null;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(data: Partial<Imagen>) {
    Object.assign(this, data);
  }
}