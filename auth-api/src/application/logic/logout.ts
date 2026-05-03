import { Injectable, Inject } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';
import { AUTH_REPOSITORY } from '../../domain/interfaces/auth/auth.tokens';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
  ) { }

  async execute(token: string): Promise<{ mensaje: string }> {
    await this.authRepository.revocarTokenRefresco(token);
    return { mensaje: 'Sesión cerrada correctamente' };
  }
}