export class Material {
  id!: number;
  nombre!: string;
  descripcion!: string | null;
  url!: string;
  rutaArchivo!: string;
  orden!: number;
  seccionId!: number | null;
  creadoPor!: number | null;
  actualizadoPor!: number | null;
  creadoEn!: Date;
  actualizadoEn!: Date;

  constructor(data: Partial<Material>) {
    Object.assign(this, data);
  }
}
