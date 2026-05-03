export class Patrocinador {
  id!: number;
  nombre!: string;
  url!: string;
  rutaArchivo!: string;
  orden!: number;
  creadoPor!: number | null;
  actualizadoPor!: number | null;
  creadoEn!: Date;
  actualizadoEn!: Date;

  constructor(data: Partial<Patrocinador>) {
    Object.assign(this, data);
  }
}
