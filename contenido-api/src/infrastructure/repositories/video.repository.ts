import { Injectable } from '@nestjs/common';
import { IVideoRepository } from '../../domain/interfaces/video.repository.interface';
import { Video } from '../../domain/entities/video.entity';
import { prisma } from '../database/prisma';

@Injectable()
export class VideoRepository implements IVideoRepository {
  async encontrarTodos(): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      orderBy: { orden: 'asc' },
    });
    return videos.map((v) => new Video(v));
  }

  async encontrarPorSeccion(seccionId: number): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: { seccionId },
      orderBy: { orden: 'asc' },
    });
    return videos.map((v) => new Video(v));
  }

  async encontrarPorId(id: number): Promise<Video | null> {
    const video = await prisma.video.findUnique({ where: { id } });
    return video ? new Video(video) : null;
  }

  async crear(data: Partial<Video>): Promise<Video> {
    const video = await prisma.video.create({ data: data as any });
    return new Video(video);
  }

  async actualizar(id: number, data: Partial<Video>): Promise<Video> {
    const video = await prisma.video.update({ where: { id }, data: data as any });
    return new Video(video);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.video.delete({ where: { id } });
  }
}
