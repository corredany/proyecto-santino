import { Injectable, ConflictException } from '@nestjs/common';
import { IsEmail, IsInt, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { prisma } from '../../../infrastructure/database/prisma';

export class CrearUsuarioDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsInt()
  rolId: number;
}

@Injectable()
export class CrearUsuarioUseCase {
  async execute(dto: CrearUsuarioDto) {
    const existe = await prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existe) throw new ConflictException('El email ya está registrado');

    const hash = await bcrypt.hash(dto.contrasena, 10);

    return prisma.usuario.create({
      data: { nombre: dto.nombre, email: dto.email, contrasena: hash, rolId: dto.rolId },
      select: { id: true, nombre: true, email: true, rolId: true, rol: true, creadoEn: true, actualizadoEn: true },
    });
  }
}
