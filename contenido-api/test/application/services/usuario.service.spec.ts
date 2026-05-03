import { UsuarioService } from '../../../src/application/services/usuario.service';
import { Usuario } from '../../../src/domain/entities/usuario.entity';
import {
  UsuarioNoEncontradoException,
  EmailDuplicadoException,
} from '../../../src/domain/exceptions/usuario.exception';

const mockUsuarioRepository = {
  encontrarTodos: jest.fn(),
  encontrarPorId: jest.fn(),
  encontrarPorEmail: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;

  beforeEach(() => {
    usuarioService = new UsuarioService(mockUsuarioRepository as any);
    jest.clearAllMocks();
  });

  describe('obtenerPorId', () => {
    it('debe lanzar excepción si el usuario no existe', async () => {
      mockUsuarioRepository.encontrarPorId.mockResolvedValue(null);
      await expect(usuarioService.obtenerPorId(999)).rejects.toThrow(
        UsuarioNoEncontradoException,
      );
    });

    it('debe retornar el usuario si existe', async () => {
      const usuario = new Usuario({ id: 1, nombre: 'Admin', email: 'admin@test.com' });
      mockUsuarioRepository.encontrarPorId.mockResolvedValue(usuario);
      const resultado = await usuarioService.obtenerPorId(1);
      expect(resultado).toEqual(usuario);
    });
  });

  describe('crear', () => {
    it('debe lanzar excepción si el email ya existe', async () => {
      const usuario = new Usuario({ id: 1, email: 'admin@test.com' });
      mockUsuarioRepository.encontrarPorEmail.mockResolvedValue(usuario);

      await expect(
        usuarioService.crear({
          nombre: 'Nuevo',
          email: 'admin@test.com',
          contrasena: '123456',
          rolId: 1,
        }),
      ).rejects.toThrow(EmailDuplicadoException);
    });

    it('debe crear el usuario si el email no existe', async () => {
      mockUsuarioRepository.encontrarPorEmail.mockResolvedValue(null);
      const usuarioCreado = new Usuario({ id: 2, nombre: 'Nuevo', email: 'nuevo@test.com' });
      mockUsuarioRepository.crear.mockResolvedValue(usuarioCreado);

      const resultado = await usuarioService.crear({
        nombre: 'Nuevo',
        email: 'nuevo@test.com',
        contrasena: '123456',
        rolId: 1,
      });

      expect(resultado).toEqual(usuarioCreado);
    });
  });

  describe('eliminar', () => {
    it('debe lanzar excepción si el usuario no existe', async () => {
      mockUsuarioRepository.encontrarPorId.mockResolvedValue(null);
      await expect(usuarioService.eliminar(999)).rejects.toThrow(
        UsuarioNoEncontradoException,
      );
    });

    it('debe eliminar el usuario si existe', async () => {
      const usuario = new Usuario({ id: 1, nombre: 'Admin' });
      mockUsuarioRepository.encontrarPorId.mockResolvedValue(usuario);
      mockUsuarioRepository.eliminar.mockResolvedValue(undefined);
      await usuarioService.eliminar(1);
      expect(mockUsuarioRepository.eliminar).toHaveBeenCalledWith(1);
    });
  });
});