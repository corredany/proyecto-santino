import { Seccion } from '../entities/seccion.entity';

export interface ISeccionRepository {
  encontrarTodos(): Promise<Seccion[]>;
  encontrarVisibles(): Promise<Seccion[]>;
  encontrarPorId(id: number): Promise<Seccion | null>;
  crear(data: Partial<Seccion>): Promise<Seccion>;
  actualizar(id: number, data: Partial<Seccion>): Promise<Seccion>;
  actualizarOrden(secciones: { id: number; orden: number }[]): Promise<void>;
  eliminar(id: number): Promise<void>;
}