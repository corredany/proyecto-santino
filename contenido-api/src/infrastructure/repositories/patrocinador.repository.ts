import { Injectable } from '@nestjs/common';
import { IPatrocinadorRepository } from '../../domain/interfaces/patrocinador.repository.interface';
import { Patrocinador } from '../../domain/entities/patrocinador.entity';
import { prisma } from '../database/prisma';

@Injectable()
export class PatrocinadorRepository implements IPatrocinadorRepository {
  async encontrarTodos(): Promise<Patrocinador[]> {
    const patrocinadores = await prisma.patrocinador.findMany({
      orderBy: { orden: 'asc' },
    });
    return patrocinadores.map((p) => new Patrocinador(p));
  }

  async encontrarPorId(id: number): Promise<Patrocinador | null> {
    const patrocinador = await prisma.patrocinador.findUnique({ where: { id } });
    return patrocinador ? new Patrocinador(patrocinador) : null;
  }

  async crear(data: Partial<Patrocinador>): Promise<Patrocinador> {
    const patrocinador = await prisma.patrocinador.create({ data: data as any });
    return new Patrocinador(patrocinador);
  }

  async actualizar(id: number, data: Partial<Patrocinador>): Promise<Patrocinador> {
    const patrocinador = await prisma.patrocinador.update({ where: { id }, data: data as any });
    return new Patrocinador(patrocinador);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.patrocinador.delete({ where: { id } });
  }
}
