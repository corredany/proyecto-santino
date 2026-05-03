import { Injectable, Inject } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';
import type { ITokenService } from '../../domain/interfaces/auth/token.service.interface';
import { AUTH_REPOSITORY, TOKEN_SERVICE } from '../../domain/interfaces/auth/auth.tokens';
import {
  TokenInvalidoException,
  TokenRevocadoException,
  UsuarioNoEncontradoException,
} from '../../domain/exceptions/auth.exception';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) {}

  async execute(token: string): Promise<{ accessToken: string }> {
    const payload = this.tokenService.verificarRefreshToken(token);
    if (!payload) throw new TokenInvalidoException();

    const tokenRefresco = await this.authRepository.encontrarTokenRefresco(token);
    if (!tokenRefresco) throw new TokenInvalidoException();

    if (!tokenRefresco.estaVigente()) throw new TokenRevocadoException();

    const usuario = await this.authRepository.encontrarUsuarioPorId(payload.id);
    if (!usuario) throw new UsuarioNoEncontradoException();

    const accessToken = this.tokenService.generarAccessToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
      rolNombre: usuario.rolNombre,
      permisos: usuario.permisos ?? [],
    });

    return { accessToken };
  }
}
