import { Controller, Post, Body, Ip, Headers, HttpCode } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { LoginUseCase } from '../logic/login';
import { RefreshTokenUseCase } from '../logic/refreshtoken';
import { LogoutUseCase } from '../logic/logout';
import type { LoginDto, RefreshTokenDto, LogoutDto } from '../../domain/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @HttpCode(200)
  @Throttle({ login: { ttl: 60000, limit: 5 } })
  login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.loginUseCase.execute(dto, ip, userAgent);
  }

  @Post('refresh')
  @HttpCode(200)
  @SkipThrottle()
  refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto.token);
  }

  @Post('logout')
  @HttpCode(200)
  @SkipThrottle()
  logout(@Body() dto: LogoutDto) {
    return this.logoutUseCase.execute(dto.token);
  }
}