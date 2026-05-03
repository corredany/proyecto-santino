import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './application/controllers/auth.controller';
import { LoginUseCase } from './application/logic/login';
import { RefreshTokenUseCase } from './application/logic/refreshtoken';
import { LogoutUseCase } from './application/logic/logout';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { HashHelper } from './infrastructure/helpers/hash.helper';
import { TokenHelper } from './infrastructure/helpers/token.helper';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AUTH_REPOSITORY, HASH_SERVICE, TOKEN_SERVICE } from './domain/interfaces/auth/auth.tokens';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_REPOSITORY, useClass: AuthRepository },
    { provide: HASH_SERVICE, useClass: HashHelper },
    { provide: TOKEN_SERVICE, useClass: TokenHelper },
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtStrategy,
  ],
})
export class AuthModule {}