import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../../../infrastructure/database/prisma';

@Injectable()
export class EliminarUsuarioUseCase {
  async execute(id: number) {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    await prisma.tokenRefresco.deleteMany({ where: { usuarioId: id } });
    await prisma.usuario.delete({ where: { id } });
  }
}
