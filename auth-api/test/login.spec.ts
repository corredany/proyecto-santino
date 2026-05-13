import { LoginUseCase } from '../src/application/logic/login';
import { IAuthRepository } from '../src/domain/interfaces/auth/auth.repository.interface';
import { IHashService } from '../src/domain/interfaces/auth/hash.service.interface';
import { ITokenService } from '../src/domain/interfaces/auth/token.service.interface';
import { CredencialesInvalidasException } from '../src/domain/exceptions/auth.exception';

const ACCESS_TOKEN_FAKE = 'access_token_fake';
const REFRESH_TOKEN_FAKE = 'refresh_token_fake';
const EMAIL_VALIDO = 'admin@test.com';

const usuarioMock = {
  id: 1,
  nombre: 'Admin',
  email: EMAIL_VALIDO,
  contrasena: 'hash_encriptado',
  rolId: 1,
  rolNombre: 'admin',
  permisos: ['contenido:gestionar', 'usuarios:gestionar'],
};

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
        loginUseCase.execute({ email: 'noexiste@test.com', contrasena: '123456' }, '127.0.0.1', 'Mozilla'),
      ).rejects.toThrow(CredencialesInvalidasException);
    });

    it('debe NO verificar la contraseña si el usuario no existe', async () => {
      await expect(
        loginUseCase.execute({ email: 'noexiste@test.com', contrasena: '123456' }, '127.0.0.1', 'Mozilla'),
      ).rejects.toThrow();

      expect(mockHashService.verificar).not.toHaveBeenCalled();
    });
  });

  describe('cuando la contraseña es incorrecta', () => {
    beforeEach(() => {
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue(usuarioMock as any);
      mockHashService.verificar.mockResolvedValue(false);
    });

    it('debe lanzar CredencialesInvalidasException', async () => {
      await expect(
        loginUseCase.execute({ email: EMAIL_VALIDO, contrasena: 'incorrecta' }, '127.0.0.1', 'Mozilla'),
      ).rejects.toThrow(CredencialesInvalidasException);
    });

    it('debe NO generar tokens si la contraseña es incorrecta', async () => {
      await expect(
        loginUseCase.execute({ email: EMAIL_VALIDO, contrasena: 'incorrecta' }, '127.0.0.1', 'Mozilla'),
      ).rejects.toThrow();

      expect(mockTokenService.generarAccessToken).not.toHaveBeenCalled();
      expect(mockTokenService.generarRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('cuando las credenciales son válidas', () => {
    beforeEach(() => {
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue(usuarioMock as any);
      mockHashService.verificar.mockResolvedValue(true);
      mockTokenService.generarAccessToken.mockReturnValue(ACCESS_TOKEN_FAKE);
      mockTokenService.generarRefreshToken.mockReturnValue(REFRESH_TOKEN_FAKE);
      mockAuthRepository.guardarTokenRefresco.mockResolvedValue(undefined as any);
    });

    it('debe retornar accessToken y refreshToken', async () => {
      const resultado = await loginUseCase.execute(
        { email: EMAIL_VALIDO, contrasena: '123456' },
        '127.0.0.1',
        'Mozilla',
      );

      expect(resultado.accessToken).toBe(ACCESS_TOKEN_FAKE);
      expect(resultado.refreshToken).toBe(REFRESH_TOKEN_FAKE);
    });

    it('debe retornar los datos del usuario sin contrasena', async () => {
      const resultado = await loginUseCase.execute(
        { email: EMAIL_VALIDO, contrasena: '123456' },
        '127.0.0.1',
        'Mozilla',
      );

      expect(resultado.usuario).toEqual({
        id: 1,
        nombre: 'Admin',
        email: EMAIL_VALIDO,
        rolId: 1,
        rolNombre: 'admin',
      });
      expect(resultado.usuario).not.toHaveProperty('contrasena');
    });

    it('debe llamar a generarAccessToken con los datos del usuario', async () => {
      await loginUseCase.execute(
        { email: EMAIL_VALIDO, contrasena: '123456' },
        '127.0.0.1',
        'Mozilla',
      );

      expect(mockTokenService.generarAccessToken).toHaveBeenCalledWith({
        id: 1,
        email: EMAIL_VALIDO,
        rolId: 1,
        rolNombre: 'admin',
        permisos: ['contenido:gestionar', 'usuarios:gestionar'],
      });
    });

    it('debe guardar el refresh token en BD con ip y userAgent', async () => {
      await loginUseCase.execute(
        { email: EMAIL_VALIDO, contrasena: '123456' },
        '192.168.1.1',
        'Chrome/100',
      );

      expect(mockAuthRepository.guardarTokenRefresco).toHaveBeenCalledWith(
        expect.objectContaining({
          token: REFRESH_TOKEN_FAKE,
          usuarioId: 1,
          revocado: false,
          revocadoEn: null,
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome/100',
        }),
      );
    });

    it('debe usar arreglo vacío si el usuario no tiene permisos definidos', async () => {
      mockAuthRepository.encontrarUsuarioPorEmail.mockResolvedValue({
        ...usuarioMock,
        permisos: undefined,
      } as any);

      await loginUseCase.execute(
        { email: EMAIL_VALIDO, contrasena: '123456' },
        '127.0.0.1',
        'Mozilla',
      );

      expect(mockTokenService.generarAccessToken).toHaveBeenCalledWith(
        expect.objectContaining({ permisos: [] }),
      );
    });
  });
});
