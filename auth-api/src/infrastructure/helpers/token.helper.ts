import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/interfaces/auth/token.service.interface';
import { jwtConfig } from '../config/jwt.config';

@Injectable()
export class TokenHelper implements ITokenService {
  generarAccessToken(payload: { id: number; email: string; rolId: number; rolNombre: string; permisos: string[] }): string {
    return jwt.sign(payload, jwtConfig.secret as string, {
      expiresIn: jwtConfig.accessTokenExpiration as any,
    });
  }

  generarRefreshToken(payload: { id: number }): string {
    return jwt.sign(payload, jwtConfig.secret as string, {
      expiresIn: jwtConfig.refreshTokenExpiration as any,
    });
  }

  verificarAccessToken(token: string): { id: number; email: string; rolId: number; rolNombre: string; permisos: string[] } | null {
    try {
      return jwt.verify(token, jwtConfig.secret as string) as any;
    } catch {
      return null;
    }
  }

  verificarRefreshToken(token: string): { id: number } | null {
    try {
      return jwt.verify(token, jwtConfig.secret as string) as any;
    } catch {
      return null;
    }
  }
}
