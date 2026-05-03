import { Injectable } from '@nestjs/common';
import { ISeccionRepository } from '../../domain/interfaces/seccion.repository.interface';
import { Seccion } from '../../domain/entities/seccion.entity';
import { prisma } from '../database/prisma';

@Injectable()
export class SeccionRepository implements ISeccionRepository {
  async encontrarTodos(): Promise<Seccion[]> {
    const secciones = await prisma.seccion.findMany({
      orderBy: { orden: 'asc' },
    });
    return secciones.map((s) => new Seccion(s));
  }

  async encontrarVisibles(): Promise<Seccion[]> {
    const secciones = await prisma.seccion.findMany({
      where: { visible: true },
      orderBy: { orden: 'asc' },
    });
    return secciones.map((s) => new Seccion(s));
  }

  async encontrarPorId(id: number): Promise<Seccion | null> {
    const seccion = await prisma.seccion.findUnique({
      where: { id },
    });
    return seccion ? new Seccion(seccion) : null;
  }

  async crear(data: Partial<Seccion>): Promise<Seccion> {
    const seccion = await prisma.seccion.create({
      data: data as any,
    });
    return new Seccion(seccion);
  }

  async actualizar(id: number, data: Partial<Seccion>): Promise<Seccion> {
    const seccion = await prisma.seccion.update({
      where: { id },
      data: data as any,
    });
    return new Seccion(seccion);
  }

  async actualizarOrden(secciones: { id: number; orden: number }[]): Promise<void> {
    await Promise.all(
      secciones.map((s) =>
        prisma.seccion.update({
          where: { id: s.id },
          data: { orden: s.orden },
        }),
      ),
    );
  }

  async eliminar(id: number): Promise<void> {
    await prisma.seccion.delete({
      where: { id },
    });
  }
}