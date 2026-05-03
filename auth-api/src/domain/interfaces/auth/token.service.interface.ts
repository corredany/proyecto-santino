export interface ITokenService {
  generarAccessToken(payload: { id: number; email: string; rolId: number; rolNombre: string; permisos: string[] }): string;
  generarRefreshToken(payload: { id: number }): string;
  verificarAccessToken(token: string): { id: number; email: string; rolId: number; rolNombre: string; permisos: string[] } | null;
  verificarRefreshToken(token: string): { id: number } | null;
}
