import { Video } from '../entities/video.entity';

export interface IVideoRepository {
  encontrarTodos(): Promise<Video[]>;
  encontrarPorSeccion(seccionId: number): Promise<Video[]>;
  encontrarPorId(id: number): Promise<Video | null>;
  crear(data: Omit<Video, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Video>;
  actualizar(id: number, data: Partial<Omit<Video, 'id' | 'creadoEn' | 'actualizadoEn'>>): Promise<Video>;
  eliminar(id: number): Promise<void>;
}
