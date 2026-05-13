import { Controller, Get } from '@nestjs/common';
import { prisma } from '../../infrastructure/database/prisma';

@Controller('roles')
export class RolesController {
  @Get()
  obtenerTodos() {
    return prisma.rol.findMany({ orderBy: { id: 'asc' } });
  }
}
