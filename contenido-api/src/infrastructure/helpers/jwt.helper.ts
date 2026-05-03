import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

export class JwtHelper {
  static generarAccessToken(payload: {
    id: number;
    email: string;
    rolId: number;
  }): string {
    return jwt.sign(payload, jwtConfig.secret as string, {
      expiresIn: jwtConfig.accessTokenExpiration as any,
    });
  }

  static generarRefreshToken(payload: { id: number }): string {
    return jwt.sign(payload, jwtConfig.secret as string, {
      expiresIn: jwtConfig.refreshTokenExpiration as any,
    });
  }

  static verificarToken(token: string): any {
    try {
      return jwt.verify(token, jwtConfig.secret as string);
    } catch {
      return null;
    }
  }
}