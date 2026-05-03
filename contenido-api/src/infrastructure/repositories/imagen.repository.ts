import { Injectable } from '@nestjs/common';
import { IImagenRepository } from '../../domain/interfaces/imagen.repository.interface';
import { Imagen } from '../../domain/entities/imagen.entity';
import { prisma } from '../database/prisma';

@Injectable()
export class ImagenRepository implements IImagenRepository {
  async encontrarTodos(): Promise<Imagen[]> {
    const imagenes = await prisma.imagen.findMany({
      orderBy: { orden: 'asc' },
    });
    return imagenes.map((i) => new Imagen(i));
  }

  async encontrarPorSeccion(seccionId: number): Promise<Imagen[]> {
    const imagenes = await prisma.imagen.findMany({
      where: { seccionId },
      orderBy: { orden: 'asc' },
    });
    return imagenes.map((i) => new Imagen(i));
  }

  async encontrarPorId(id: number): Promise<Imagen | null> {
    const imagen = await prisma.imagen.findUnique({
      where: { id },
    });
    return imagen ? new Imagen(imagen) : null;
  }

  async crear(data: Partial<Imagen>): Promise<Imagen> {
    const imagen = await prisma.imagen.create({
      data: data as any,
    });
    return new Imagen(imagen);
  }

  async actualizar(id: number, data: Partial<Imagen>): Promise<Imagen> {
    const imagen = await prisma.imagen.update({
      where: { id },
      data: data as any,
    });
    return new Imagen(imagen);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.imagen.delete({
      where: { id },
    });
  }
}