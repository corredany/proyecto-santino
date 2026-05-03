import { TokenRefresh } from '../../entities/tokenrefresh.entity';
import { Usuario } from '../../entities/usuario.entity';

export interface IAuthRepository {
  encontrarUsuarioPorEmail(email: string): Promise<Usuario | null>;
  encontrarUsuarioPorId(id: number): Promise<Usuario | null>;
  guardarTokenRefresco(data: Partial<TokenRefresh>): Promise<TokenRefresh>;
  encontrarTokenRefresco(token: string): Promise<TokenRefresh | null>;
  revocarTokenRefresco(token: string): Promise<void>;
}