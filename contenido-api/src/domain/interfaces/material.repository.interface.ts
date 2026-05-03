import { Material } from '../entities/material.entity';

export interface IMaterialRepository {
  encontrarTodos(): Promise<Material[]>;
  encontrarPorSeccion(seccionId: number): Promise<Material[]>;
  encontrarPorId(id: number): Promise<Material | null>;
  crear(data: Omit<Material, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Material>;
  actualizar(id: number, data: Partial<Omit<Material, 'id' | 'creadoEn' | 'actualizadoEn'>>): Promise<Material>;
  eliminar(id: number): Promise<void>;
}
