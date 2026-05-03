import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { prisma } from '../../infrastructure/database/prisma';

@Controller('roles')
@UseGuards(JwtGuard)
export class RolesController {
  @Get()
  obtenerTodos() {
    return prisma.rol.findMany({ orderBy: { id: 'asc' } });
  }
}
