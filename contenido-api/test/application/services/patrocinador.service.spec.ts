import { PatrocinadorService } from '../../../src/application/services/patrocinador.service';
import { Patrocinador } from '../../../src/domain/entities/patrocinador.entity';
import {
  PatrocinadorNoEncontradoException,
  ErrorSubidaPatrocinadorException,
} from '../../../src/domain/exceptions/patrocinador.exception';
import { LocalStorageHelper } from '../../../src/infrastructure/helpers/local-storage.helper';

jest.mock('../../../src/infrastructure/helpers/local-storage.helper', () => ({
  LocalStorageHelper: {
    guardar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const mockPatrocinadorRepository = {
  encontrarTodos: jest.fn(),
  encontrarPorId: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

const patrocinadorMock = new Patrocinador({
  id: 1,
  nombre: 'Empresa ABC',
  url: 'http://localhost:3000/uploads/patrocinadores/logo.png',
  rutaArchivo: 'patrocinadores/logo.png',
  orden: 0,
  creadoPor: 1,
  actualizadoPor: 1,
});

const archivoMock = {
  originalname: 'logo.png',
  buffer: Buffer.from('fake'),
  mimetype: 'image/png',
} as Express.Multer.File;

describe('PatrocinadorService', () => {
  let patrocinadorService: PatrocinadorService;

  beforeEach(() => {
    patrocinadorService = new PatrocinadorService(mockPatrocinadorRepository as any);
    jest.clearAllMocks();
  });

  describe('obtenerTodos', () => {
    it('debe retornar todos los patrocinadores', async () => {
      mockPatrocinadorRepository.encontrarTodos.mockResolvedValue([patrocinadorMock]);
      const resultado = await patrocinadorService.obtenerTodos();
      expect(resultado).toEqual([patrocinadorMock]);
    });
  });

  describe('obtenerPorId', () => {
    it('debe lanzar excepción si el patrocinador no existe', async () => {
      mockPatrocinadorRepository.encontrarPorId.mockResolvedValue(null);
      await expect(patrocinadorService.obtenerPorId(999)).rejects.toThrow(
        PatrocinadorNoEncontradoException,
      );
    });

    it('debe retornar el patrocinador si existe', async () => {
      mockPatrocinadorRepository.encontrarPorId.mockResolvedValue(patrocinadorMock);
      const resultado = await patrocinadorService.obtenerPorId(1);
      expect(resultado).toEqual(patrocinadorMock);
    });
  });

  describe('crear', () => {
    beforeEach(() => {
      (LocalStorageHelper.guardar as jest.Mock).mockResolvedValue({
        url: 'http://localhost:3000/uploads/patrocinadores/logo.png',
        rutaArchivo: 'patrocinadores/logo.png',
      });
      mockPatrocinadorRepository.crear.mockResolvedValue(patrocinadorMock);
    });

    it('debe guardar el archivo y crear el registro en BD', async () => {
      const resultado = await patrocinadorService.crear(archivoMock, { nombre: 'Empresa ABC', orden: 0 }, 1);
      expect(LocalStorageHelper.guardar).toHaveBeenCalledWith(archivoMock, 'patrocinadores');
      expect(mockPatrocinadorRepository.crear).toHaveBeenCalled();
      expect(resultado).toEqual(patrocinadorMock);
    });

    it('debe pasar el usuarioId como creadoPor y actualizadoPor', async () => {
      await patrocinadorService.crear(archivoMock, { nombre: 'Empresa ABC', orden: 0 }, 42);
      expect(mockPatrocinadorRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ creadoPor: 42, actualizadoPor: 42 }),
      );
    });

    it('debe usar orden 0 cuando no se proporciona', async () => {
      await patrocinadorService.crear(archivoMock, { nombre: 'Empresa ABC' }, 1);
      expect(mockPatrocinadorRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ orden: 0 }),
      );
    });

    it('debe lanzar ErrorSubidaPatrocinadorException si falla el guardado', async () => {
      (LocalStorageHelper.guardar as jest.Mock).mockRejectedValue(new Error('IO error'));
      await expect(
        patrocinadorService.crear(archivoMock, { nombre: 'Empresa ABC' }, 1),
      ).rejects.toThrow(ErrorSubidaPatrocinadorException);
    });
  });

  describe('actualizar', () => {
    it('debe lanzar excepción si el patrocinador no existe', async () => {
      mockPatrocinadorRepository.encontrarPorId.mockResolvedValue(null);
      await expect(patrocinadorService.actualizar(999, { nombre: 'Nuevo' }, 1)).rejects.toThrow(
        PatrocinadorNoEncontradoException,
      );
    });

    it('debe actualizar el patrocinador e incluir actualizadoPor', async () => {
      mockPatrocinadorRepository.encontrarPorId.mockResolvedValue(patrocinadorMock);
      mockPatrocinadorRepository.actualizar.mockResolvedValue({
        ...patrocinadorMock,
        nombre: 'Nuevo Nombre',
      });
      const resultado = await patrocinadorService.actualizar(1, { nombre: 'Nuevo Nombre' }, 2);
      expect(mockPatrocinadorRepository.actualizar).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ nombre: 'Nuevo Nombre', actualizadoPor: 2 }),
      );
      expect(resultado.nombre).toBe('Nuevo Nombre');
    });
  });

  describe('eliminar', () => {
    it('debe lanzar excepción si el patrocinador no existe', async () => {
      mockPatrocinadorRepository.encontrarPorId.mockResolvedValue(null);
      await expect(patrocinadorService.eliminar(999)).rejects.toThrow(
        PatrocinadorNoEncontradoException,
      );
    });

    it('debe eliminar el archivo del disco y el registro de BD', async () => {
      mockPatrocinadorRepository.encontrarPorId.mockResolvedValue(patrocinadorMock);
      (LocalStorageHelper.eliminar as jest.Mock).mockResolvedValue(undefined);
      mockPatrocinadorRepository.eliminar.mockResolvedValue(undefined);

      await patrocinadorService.eliminar(1);

      expect(LocalStorageHelper.eliminar).toHaveBeenCalledWith('patrocinadores/logo.png');
      expect(mockPatrocinadorRepository.eliminar).toHaveBeenCalledWith(1);
    });
  });
});
