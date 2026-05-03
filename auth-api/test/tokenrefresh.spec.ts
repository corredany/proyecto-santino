import { RefreshTokenUseCase } from '../src/application/logic/refreshtoken';
import { IAuthRepository } from '../src/domain/interfaces/auth/auth.repository.interface';
import { ITokenService } from '../src/domain/interfaces/auth/token.service.interface';
import { Usuario } from '../src/domain/entities/usuario.entity';
import { TokenRefresh } from '../src/domain/entities/tokenrefresh.entity';
import {
  TokenInvalidoException,
  TokenRevocadoException,
  UsuarioNoEncontradoException,
} from '../src/domain/exceptions/auth.exception';

const ACCESS_TOKEN_FAKE = 'access_token_fake';
const REFRESH_TOKEN_FAKE = 'refresh_token_fake';
const EMAIL_VALIDO = 'admin@test.com';

const crearUsuarioMock = (overrides: Partial<Usuario> = {}): Usuario => {
  return new Usuario({
    id: 1,
    nombre: 'Admin',
    email: EMAIL_VALIDO,
    contrasena: 'hash_encriptado',
    rolId: 1,
    rolNombre: 'admin',
    permisos: ['contenido:gestionar', 'usuarios:gestionar'],
    ...overrides,
  });
};

const crearTokenRefrescoVigente = (overrides: Partial<TokenRefresh> = {}): TokenRefresh => {
  const expiraEn = new Date();
  expiraEn.setDate(expiraEn.getDate() + 7);
  return new TokenRefresh({
    id: 1,
    token: REFRESH_TOKEN_FAKE,
    usuarioId: 1,
    expiraEn,
    revocado: false,
    revocadoEn: null,
    ...overrides,
  });
};

const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  encontrarUsuarioPorEmail: jest.fn(),
  encontrarUsuarioPorId: jest.fn(),
  guardarTokenRefresco: jest.fn(),
  encontrarTokenRefresco: jest.fn(),
  revocarTokenRefresco: jest.fn(),
};

const mockTokenService: jest.Mocked<ITokenService> = {
  generarAccessToken: jest.fn(),
  generarRefreshToken: jest.fn(),
  verificarAccessToken: jest.fn(),
  verificarRefreshToken: jest.fn(),
};

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(() => {
    refreshTokenUseCase = new RefreshTokenUseCase(mockAuthRepository, mockTokenService);
    jest.clearAllMocks();
  });

  describe('cuando el token es inválido', () => {
    beforeEach(() => {
      mockTokenService.verificarRefreshToken.mockReturnValue(null);
    });

    it('debe lanzar TokenInvalidoException', async () => {
      await expect(
        refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE),
      ).rejects.toThrow(TokenInvalidoException);
    });

    it('debe NO buscar el token en la BD', async () => {
      await expect(
        refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE),
      ).rejects.toThrow();

      expect(mockAuthRepository.encontrarTokenRefresco).not.toHaveBeenCalled();
    });
  });

  describe('cuando el token no existe en BD', () => {
    beforeEach(() => {
      mockTokenService.verificarRefreshToken.mockReturnValue({ id: 1 });
      mockAuthRepository.encontrarTokenRefresco.mockResolvedValue(null);
    });

    it('debe lanzar TokenInvalidoException', async () => {
      await expect(
        refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE),
      ).rejects.toThrow(TokenInvalidoException);
    });

    it('debe NO buscar al usuario', async () => {
      await expect(
        refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE),
      ).rejects.toThrow();

      expect(mockAuthRepository.encontrarUsuarioPorId).not.toHaveBeenCalled();
    });
  });

  describe('cuando el token está revocado', () => {
    beforeEach(() => {
      mockTokenService.verificarRefreshToken.mockReturnValue({ id: 1 });
      mockAuthRepository.encontrarTokenRefresco.mockResolvedValue(
        crearTokenRefrescoVigente({ revocado: true }),
      );
    });

    it('debe lanzar TokenRevocadoException', async () => {
      await expect(
        refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE),
      ).rejects.toThrow(TokenRevocadoException);
    });

    it('debe NO generar nuevo accessToken', async () => {
      await expect(
        refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE),
      ).rejects.toThrow();

      expect(mockTokenService.generarAccessToken).not.toHaveBeenCalled();
    });
  });

  describe('cuando el usuario no existe', () => {
    beforeEach(() => {
      mockTokenService.verificarRefreshToken.mockReturnValue({ id: 1 });
      mockAuthRepository.encontrarTokenRefresco.mockResolvedValue(crearTokenRefrescoVigente());
      mockAuthRepository.encontrarUsuarioPorId.mockResolvedValue(null);
    });

    it('debe lanzar UsuarioNoEncontradoException', async () => {
      await expect(
        refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE),
      ).rejects.toThrow(UsuarioNoEncontradoException);
    });
  });

  describe('cuando el token es válido', () => {
    beforeEach(() => {
      mockTokenService.verificarRefreshToken.mockReturnValue({ id: 1 });
      mockAuthRepository.encontrarTokenRefresco.mockResolvedValue(crearTokenRefrescoVigente());
      mockAuthRepository.encontrarUsuarioPorId.mockResolvedValue(crearUsuarioMock());
      mockTokenService.generarAccessToken.mockReturnValue(ACCESS_TOKEN_FAKE);
    });

    it('debe retornar nuevo accessToken', async () => {
      const resultado = await refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE);

      expect(resultado).toEqual(
        expect.objectContaining({
          accessToken: ACCESS_TOKEN_FAKE,
        }),
      );
    });

    it('debe llamar a generarAccessToken con los datos del usuario', async () => {
      await refreshTokenUseCase.execute(REFRESH_TOKEN_FAKE);

      expect(mockTokenService.generarAccessToken).toHaveBeenCalledWith({
        id: 1,
        email: EMAIL_VALIDO,
        rolId: 1,
        rolNombre: 'admin',
        permisos: ['contenido:gestionar', 'usuarios:gestionar'],
      });
    });
  });
});
