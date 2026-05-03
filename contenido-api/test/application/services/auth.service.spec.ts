import { AuthService } from '../../../src/application/services/auth.service';
import { CredencialesInvalidasException, TokenInvalidoException, TokenRevocadoException } from '../../../src/domain/exceptions/auth.exception';
import { Usuario } from '../../../src/domain/entities/usuario.entity';
import { TokenRefresco } from '../../../src/domain/entities/token-refresco.entity';

// Mock del repositorio
const mockAuthRepository = {
  encontrarUsuarioPorEmail: jest.fn(),
  encontrarUsuarioPorId: jest.fn(),
  guardarTokenRefresco: jest.fn(),
  encontrarTokenRefresco: jest.fn(),
  revocarTokenRefresco: jest.fn(),
  revocarTodosLosTokens: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockAuthRepository as any);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe lanzar excepción si el usuario no existe', async () => {
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'noexiste@test.com', contrasena: '123456' }, '', ''),
      ).rejects.toThrow(CredencialesInvalidasException);
    });

    it('debe lanzar excepción si la contraseña es incorrecta', async () => {
      const usuario = new Usuario({
        id: 1,
        email: 'admin@test.com',
        contrasena: '$2b$10$hashinvalido',
        rolId: 1,
      });
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue(usuario);

      await expect(
        authService.login({ email: 'admin@test.com', contrasena: 'incorrecta' }, '', ''),
      ).rejects.toThrow(CredencialesInvalidasException);
    });
  });

  describe('refresh', () => {
    it('debe lanzar excepción si el token es inválido', async () => {
      await expect(authService.refresh('token_invalido')).rejects.toThrow(
        TokenInvalidoException,
      );
    });

    it('debe lanzar excepción si el token está revocado', async () => {
      const expiraEn = new Date();
      expiraEn.setDate(expiraEn.getDate() + 7);

      const tokenRevocado = new TokenRefresco({
        revocado: true,
        expiraEn,
      });

      mockAuthRepository.encontrarTokenRefresco.mockResolvedValue(tokenRevocado);

      await expect(authService.refresh('token_invalido')).rejects.toThrow(
        TokenInvalidoException,
      );
    });
  });

  describe('logout', () => {
    it('debe revocar el token correctamente', async () => {
      mockAuthRepository.revocarTokenRefresco.mockResolvedValue(undefined);
      await authService.logout('token_valido');
      expect(mockAuthRepository.revocarTokenRefresco).toHaveBeenCalledWith('token_valido');
    });
  });
});