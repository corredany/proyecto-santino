export interface LoginDto {
  email: string;
  contrasena: string;
}

export interface RefreshTokenDto {
  token: string;
}

export interface LogoutDto {
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