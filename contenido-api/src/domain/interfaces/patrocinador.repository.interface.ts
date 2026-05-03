import { Patrocinador } from '../entities/patrocinador.entity';

export interface IPatrocinadorRepository {
  encontrarTodos(): Promise<Patrocinador[]>;
  encontrarPorId(id: number): Promise<Patrocinador | null>;
  crear(data: Omit<Patrocinador, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Patrocinador>;
  actualizar(id: number, data: Partial<Omit<Patrocinador, 'id' | 'creadoEn' | 'actualizadoEn'>>): Promise<Patrocinador>;
  eliminar(id: number): Promise<void>;
}
