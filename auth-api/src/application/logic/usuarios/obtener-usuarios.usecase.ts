import { Injectable } from '@nestjs/common';
import { prisma } from '../../../infrastructure/database/prisma';

@Injectable()
export class ObtenerUsuariosUseCase {
  execute() {
    return prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rolId: true, rol: true, creadoEn: true, actualizadoEn: true },
      orderBy: { id: 'asc' },
    });
  }
}
