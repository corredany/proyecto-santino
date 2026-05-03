export interface Cita {
  id: number;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  fecha: string;
  hora: string;
  estado: string;
  notas: string | null;
  atendidoPor: string | null;
  creadoEn: string;
}

export interface CrearCitaDto {
  clienteId: number;
  fecha: string;
  descripcion?: string;
}

export interface ActualizarCitaDto {
  fecha?: string;
  notas?: string;
  estado?: string;
}
