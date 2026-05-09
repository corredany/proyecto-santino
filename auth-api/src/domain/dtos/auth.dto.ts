import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  contrasena: string;
}

export class RefreshTokenDto {
  @IsString()
  @MinLength(1)
  token: string;
}

export class LogoutDto {
  @IsString()
  @MinLength(1)
  token: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rolId: number;
    rolNombre: string;
  };
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}