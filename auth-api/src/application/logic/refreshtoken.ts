import { Injectable, Inject } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';
import type { ITokenService } from '../../domain/interfaces/auth/token.service.interface';
import { AUTH_REPOSITORY, TOKEN_SERVICE } from '../../domain/interfaces/auth/auth.tokens';
import type { RefreshResponseDto } from '../../domain/dtos/auth.dto';
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

  async execute(token: string): Promise<RefreshResponseDto> {
    const payload = this.tokenService.verificarRefreshToken(token);
    if (!payload) throw new TokenInvalidoException();

    const tokenRefresco = await this.authRepository.encontrarTokenRefresco(token);
    if (!tokenRefresco) throw new TokenInvalidoException();

    if (!tokenRefresco.estaVigente()) throw new TokenRevocadoException();

    const usuario = await this.authRepository.encontrarUsuarioPorId(payload.id);
    if (!usuario) throw new UsuarioNoEncontradoException();

    await this.authRepository.revocarTokenRefresco(token);

    const accessToken = this.tokenService.generarAccessToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
      rolNombre: usuario.rolNombre,
      permisos: usuario.permisos ?? [],
    });

    const nuevoRefreshToken = this.tokenService.generarRefreshToken({ id: usuario.id });

    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    await this.authRepository.guardarTokenRefresco({
      token: nuevoRefreshToken,
      usuarioId: usuario.id,
      expiraEn,
      revocado: false,
      revocadoEn: null,
    });

    return { accessToken, refreshToken: nuevoRefreshToken };
  }
}
