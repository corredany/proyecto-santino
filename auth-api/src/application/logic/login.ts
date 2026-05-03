import { Injectable, Inject } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';
import type { IHashService } from '../../domain/interfaces/auth/hash.service.interface';
import type { ITokenService } from '../../domain/interfaces/auth/token.service.interface';
import { AUTH_REPOSITORY, HASH_SERVICE, TOKEN_SERVICE } from '../../domain/interfaces/auth/auth.tokens';
import type { LoginDto, AuthResponseDto } from '../../domain/dtos/auth.dto';
import { CredencialesInvalidasException } from '../../domain/exceptions/auth.exception';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @Inject(HASH_SERVICE) private readonly hashService: IHashService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    const usuario = await this.authRepository.encontrarUsuarioPorEmail(dto.email);
    if (!usuario) throw new CredencialesInvalidasException();

    const contrasenaValida = await this.hashService.verificar(dto.contrasena, usuario.contrasena);
    if (!contrasenaValida) throw new CredencialesInvalidasException();

    const accessToken = this.tokenService.generarAccessToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
      rolNombre: usuario.rolNombre,
      permisos: usuario.permisos ?? [],
    });

    const refreshToken = this.tokenService.generarRefreshToken({ id: usuario.id });

    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    await this.authRepository.guardarTokenRefresco({
      token: refreshToken,
      usuarioId: usuario.id,
      expiraEn,
      revocado: false,
      revocadoEn: null,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rolId: usuario.rolId,
        rolNombre: usuario.rolNombre,
      },
    };
  }
}