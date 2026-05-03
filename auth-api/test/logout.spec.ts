import { LogoutUseCase } from '../src/application/logic/logout';
import { IAuthRepository } from '../src/domain/interfaces/auth/auth.repository.interface';

// Constantes
const REFRESH_TOKEN_FAKE = 'refresh_token_fake';

// Mocks
const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  encontrarUsuarioPorEmail: jest.fn(),
  encontrarUsuarioPorId: jest.fn(),
  guardarTokenRefresco: jest.fn(),
  encontrarTokenRefresco: jest.fn(),
  revocarTokenRefresco: jest.fn(),
};

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase;

  beforeEach(() => {
    logoutUseCase = new LogoutUseCase(mockAuthRepository);
    jest.clearAllMocks();
  });

  describe('cuando se hace logout', () => {
    beforeEach(() => {
      mockAuthRepository.revocarTokenRefresco.mockResolvedValue(undefined);
    });

    it('debe revocar el token correctamente', async () => {
      await logoutUseCase.execute(REFRESH_TOKEN_FAKE);

      expect(mockAuthRepository.revocarTokenRefresco).toHaveBeenCalledWith(REFRESH_TOKEN_FAKE);
    });

    it('debe llamar a revocarTokenRefresco exactamente una vez', async () => {
      await logoutUseCase.execute(REFRESH_TOKEN_FAKE);

      expect(mockAuthRepository.revocarTokenRefresco).toHaveBeenCalledTimes(1);
    });
  });
});