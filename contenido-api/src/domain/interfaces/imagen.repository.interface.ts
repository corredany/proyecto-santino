import { Imagen } from '../entities/imagen.entity';

export interface IImagenRepository {
  encontrarTodos(): Promise<Imagen[]>;
  encontrarPorSeccion(seccionId: number): Promise<Imagen[]>;
  encontrarPorId(id: number): Promise<Imagen | null>;
  crear(data: Partial<Imagen>): Promise<Imagen>;
  actualizar(id: number, data: Partial<Imagen>): Promise<Imagen>;
  eliminar(id: number): Promise<void>;
}