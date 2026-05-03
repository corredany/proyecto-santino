import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';
import { TokenRefresh } from '../../domain/entities/tokenrefresh.entity';
import { prisma } from '../database/prisma';

const incluirRolConPermisos = {
  rol: {
    include: {
      permisos: {
        include: { permiso: true },
      },
    },
  },
};

function mapearUsuario(u: any): Usuario {
  return new Usuario({
    ...u,
    rolNombre: u.rol.nombre,
    permisos: u.rol.permisos.map((rp: any) => rp.permiso.nombre),
  });
}

@Injectable()
export class AuthRepository implements IAuthRepository {
  async encontrarUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: incluirRolConPermisos,
    });
    if (!usuario) return null;
    return mapearUsuario(usuario);
  }

  async encontrarUsuarioPorId(id: number): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: incluirRolConPermisos,
    });
    if (!usuario) return null;
    return mapearUsuario(usuario);
  }

  async guardarTokenRefresco(data: Partial<TokenRefresh>): Promise<TokenRefresh> {
    const token = await prisma.tokenRefresco.create({
      data: data as any,
    });
    return new TokenRefresh(token);
  }

  async encontrarTokenRefresco(token: string): Promise<TokenRefresh | null> {
    const tokenRefresco = await prisma.tokenRefresco.findUnique({
      where: { token },
    });
    return tokenRefresco ? new TokenRefresh(tokenRefresco) : null;
  }

  async revocarTokenRefresco(token: string): Promise<void> {
    await prisma.tokenRefresco.update({
      where: { token },
      data: {
        revocado: true,
        revocadoEn: new Date(),
      },
    });
  }
}
