import { LoginUseCase } from '../src/application/logic/login';
import { IAuthRepository } from '../src/domain/interfaces/auth/auth.repository.interface';
import { IHashService } from '../src/domain/interfaces/auth/hash.service.interface';
import { ITokenService } from '../src/domain/interfaces/auth/token.service.interface';
import { Usuario } from '../src/domain/entities/usuario.entity';
import { TokenRefresh } from '../src/domain/entities/tokenrefresh.entity';
import { CredencialesInvalidasException } from '../src/domain/exceptions/auth.exception';

const ACCESS_TOKEN_FAKE = 'access_token_fake';
const REFRESH_TOKEN_FAKE = 'refresh_token_fake';
const EMAIL_VALIDO = 'admin@test.com';
const CONTRASENA_VALIDA = '123456';
const IP_ADDRESS = '127.0.0.1';
const USER_AGENT = 'Mozilla/5.0';

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

const crearLoginDto = (overrides = {}) => ({
  email: EMAIL_VALIDO,
  contrasena: CONTRASENA_VALIDA,
  ...overrides,
});

const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  encontrarUsuarioPorEmail: jest.fn(),
  encontrarUsuarioPorId: jest.fn(),
  guardarTokenRefresco: jest.fn(),
  encontrarTokenRefresco: jest.fn(),
  revocarTokenRefresco: jest.fn(),
};

const mockHashService: jest.Mocked<IHashService> = {
  encriptar: jest.fn(),
  verificar: jest.fn(),
};

const mockTokenService: jest.Mocked<ITokenService> = {
  generarAccessToken: jest.fn(),
  generarRefreshToken: jest.fn(),
  verificarAccessToken: jest.fn(),
  verificarRefreshToken: jest.fn(),
};

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUseCase(mockAuthRepository, mockHashService, mockTokenService);
    jest.clearAllMocks();
  });

  describe('cuando el usuario no existe', () => {
    beforeEach(() => {
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue(null);
    });

    it('debe lanzar CredencialesInvalidasException', async () => {
      await expect(
        loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT),
      ).rejects.toThrow(CredencialesInvalidasException);
    });

    it('debe NO llamar a hashService.verificar', async () => {
      await expect(
        loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT),
      ).rejects.toThrow();

      expect(mockHashService.verificar).not.toHaveBeenCalled();
    });

    it('debe NO generar tokens', async () => {
      await expect(
        loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT),
      ).rejects.toThrow();

      expect(mockTokenService.generarAccessToken).not.toHaveBeenCalled();
      expect(mockTokenService.generarRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('cuando la contraseña es incorrecta', () => {
    beforeEach(() => {
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue(crearUsuarioMock());
      mockHashService.verificar.mockResolvedValue(false);
    });

    it('debe lanzar CredencialesInvalidasException', async () => {
      await expect(
        loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT),
      ).rejects.toThrow(CredencialesInvalidasException);
    });

    it('debe NO generar tokens', async () => {
      await expect(
        loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT),
      ).rejects.toThrow();

      expect(mockTokenService.generarAccessToken).not.toHaveBeenCalled();
      expect(mockTokenService.generarRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('cuando las credenciales son válidas', () => {
    beforeEach(() => {
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue(crearUsuarioMock());
      mockHashService.verificar.mockResolvedValue(true);
      mockTokenService.generarAccessToken.mockReturnValue(ACCESS_TOKEN_FAKE);
      mockTokenService.generarRefreshToken.mockReturnValue(REFRESH_TOKEN_FAKE);
      mockAuthRepository.guardarTokenRefresco.mockResolvedValue(new TokenRefresh({}));
    });

    it('debe generar access y refresh token', async () => {
      const resultado = await loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT);

      expect(resultado).toEqual(
        expect.objectContaining({
          accessToken: ACCESS_TOKEN_FAKE,
          refreshToken: REFRESH_TOKEN_FAKE,
          usuario: expect.objectContaining({
            id: 1,
            email: EMAIL_VALIDO,
          }),
        }),
      );
    });

    it('debe llamar a generarAccessToken con los datos del usuario', async () => {
      await loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT);

      expect(mockTokenService.generarAccessToken).toHaveBeenCalledWith({
        id: 1,
        email: EMAIL_VALIDO,
        rolId: 1,
        rolNombre: 'admin',
        permisos: ['contenido:gestionar', 'usuarios:gestionar'],
      });
    });

    it('debe guardar el refresh token con los datos correctos', async () => {
      await loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT);

      expect(mockAuthRepository.guardarTokenRefresco).toHaveBeenCalledWith(
        expect.objectContaining({
          token: REFRESH_TOKEN_FAKE,
          usuarioId: 1,
          ipAddress: IP_ADDRESS,
          userAgent: USER_AGENT,
          revocado: false,
        }),
      );
    });

    it('debe llamar a hashService.verificar con la contraseña y el hash', async () => {
      await loginUseCase.execute(crearLoginDto(), IP_ADDRESS, USER_AGENT);

      expect(mockHashService.verificar).toHaveBeenCalledWith(
        CONTRASENA_VALIDA,
        'hash_encriptado',
      );
    });
  });
});
