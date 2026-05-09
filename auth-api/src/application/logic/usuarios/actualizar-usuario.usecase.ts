import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { prisma } from '../../../infrastructure/database/prisma';

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  contrasena?: string;

  @IsOptional()
  @IsInt()
  rolId?: number;
}

@Injectable()
export class ActualizarUsuarioUseCase {
  async execute(id: number, dto: ActualizarUsuarioDto) {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== usuario.email) {
      const existe = await prisma.usuario.findUnique({ where: { email: dto.email } });
      if (existe) throw new ConflictException('El email ya está registrado');
    }

    const data: any = {};
    if (dto.nombre) data.nombre = dto.nombre;
    if (dto.email) data.email = dto.email;
    if (dto.rolId) data.rolId = dto.rolId;
    if (dto.contrasena) data.contrasena = await bcrypt.hash(dto.contrasena, 10);

    return prisma.usuario.update({
      where: { id },
      data,
      select: { id: true, nombre: true, email: true, rolId: true, rol: true, creadoEn: true, actualizadoEn: true },
    });
  }
}
