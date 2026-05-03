import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret as string,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      rolId: payload.rolId,
      rolNombre: payload.rolNombre,
      permisos: payload.permisos ?? [],
    };
  }
}