import { Injectable } from '@nestjs/common';
import { IMaterialRepository } from '../../domain/interfaces/material.repository.interface';
import { Material } from '../../domain/entities/material.entity';
import { prisma } from '../database/prisma';

@Injectable()
export class MaterialRepository implements IMaterialRepository {
  async encontrarTodos(): Promise<Material[]> {
    const materiales = await prisma.material.findMany({
      orderBy: { orden: 'asc' },
    });
    return materiales.map((m) => new Material(m));
  }

  async encontrarPorSeccion(seccionId: number): Promise<Material[]> {
    const materiales = await prisma.material.findMany({
      where: { seccionId },
      orderBy: { orden: 'asc' },
    });
    return materiales.map((m) => new Material(m));
  }

  async encontrarPorId(id: number): Promise<Material | null> {
    const material = await prisma.material.findUnique({ where: { id } });
    return material ? new Material(material) : null;
  }

  async crear(data: Partial<Material>): Promise<Material> {
    const material = await prisma.material.create({ data: data as any });
    return new Material(material);
  }

  async actualizar(id: number, data: Partial<Material>): Promise<Material> {
    const material = await prisma.material.update({ where: { id }, data: data as any });
    return new Material(material);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.material.delete({ where: { id } });
  }
}
