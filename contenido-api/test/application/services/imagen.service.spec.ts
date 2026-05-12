import { ImagenService } from '../../../src/application/services/imagen.service';
import { Imagen } from '../../../src/domain/entities/imagen.entity';
import {
  ImagenNoEncontradaException,
  ErrorSubidaImagenException,
} from '../../../src/domain/exceptions/imagen.exception';
import { LocalStorageHelper } from '../../../src/infrastructure/helpers/local-storage.helper';

jest.mock('../../../src/infrastructure/helpers/local-storage.helper', () => ({
  LocalStorageHelper: {
    guardar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const mockImagenRepository = {
  encontrarTodos: jest.fn(),
  encontrarPorSeccion: jest.fn(),
  encontrarPorId: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

const imagenMock = new Imagen({
  id: 1,
  url: 'http://localhost:3000/uploads/imagenes/test.jpg',
  rutaArchivo: 'imagenes/test.jpg',
  orden: 0,
  seccionId: 1,
  creadoPor: 1,
  actualizadoPor: 1,
});

const archivoMock = {
  originalname: 'foto.jpg',
  buffer: Buffer.from('fake'),
  mimetype: 'image/jpeg',
} as Express.Multer.File;

describe('ImagenService', () => {
  let imagenService: ImagenService;

  beforeEach(() => {
    imagenService = new ImagenService(mockImagenRepository as any);
    jest.clearAllMocks();
  });

  describe('obtenerPorId', () => {
    it('debe lanzar excepción si la imagen no existe', async () => {
      mockImagenRepository.encontrarPorId.mockResolvedValue(null);
      await expect(imagenService.obtenerPorId(999)).rejects.toThrow(ImagenNoEncontradaException);
    });

    it('debe retornar la imagen si existe', async () => {
      mockImagenRepository.encontrarPorId.mockResolvedValue(imagenMock);
      const resultado = await imagenService.obtenerPorId(1);
      expect(resultado).toEqual(imagenMock);
    });
  });

  describe('subir', () => {
    beforeEach(() => {
      (LocalStorageHelper.guardar as jest.Mock).mockResolvedValue({
        url: 'http://localhost:3000/uploads/imagenes/uuid.jpg',
        rutaArchivo: 'imagenes/uuid.jpg',
      });
      mockImagenRepository.crear.mockResolvedValue(imagenMock);
    });

    it('debe guardar el archivo y crear el registro en BD', async () => {
      const resultado = await imagenService.subir(archivoMock, 1, 1, 0);
      expect(LocalStorageHelper.guardar).toHaveBeenCalledWith(archivoMock, 'imagenes');
      expect(mockImagenRepository.crear).toHaveBeenCalled();
      expect(resultado).toEqual(imagenMock);
    });

    it('debe pasar el usuarioId como creadoPor y actualizadoPor', async () => {
      await imagenService.subir(archivoMock, 42, 1, 0);
      expect(mockImagenRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ creadoPor: 42, actualizadoPor: 42 }),
      );
    });

    it('debe lanzar ErrorSubidaImagenException si falla el guardado del archivo', async () => {
      (LocalStorageHelper.guardar as jest.Mock).mockRejectedValue(new Error('IO error'));
      await expect(imagenService.subir(archivoMock, 1, 1, 0)).rejects.toThrow(
        ErrorSubidaImagenException,
      );
    });
  });

  describe('actualizar', () => {
    it('debe lanzar excepción si la imagen no existe', async () => {
      mockImagenRepository.encontrarPorId.mockResolvedValue(null);
      await expect(imagenService.actualizar(999, {}, 1)).rejects.toThrow(
        ImagenNoEncontradaException,
      );
    });

    it('debe actualizar la imagen e incluir actualizadoPor', async () => {
      mockImagenRepository.encontrarPorId.mockResolvedValue(imagenMock);
      mockImagenRepository.actualizar.mockResolvedValue({ ...imagenMock, orden: 5 });

      const resultado = await imagenService.actualizar(1, { orden: 5 }, 2);

      expect(mockImagenRepository.actualizar).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ orden: 5, actualizadoPor: 2 }),
      );
      expect(resultado.orden).toBe(5);
    });
  });

  describe('eliminar', () => {
    it('debe lanzar excepción si la imagen no existe', async () => {
      mockImagenRepository.encontrarPorId.mockResolvedValue(null);
      await expect(imagenService.eliminar(999)).rejects.toThrow(ImagenNoEncontradaException);
    });

    it('debe eliminar el archivo del disco y el registro de BD', async () => {
      mockImagenRepository.encontrarPorId.mockResolvedValue(imagenMock);
      (LocalStorageHelper.eliminar as jest.Mock).mockResolvedValue(undefined);
      mockImagenRepository.eliminar.mockResolvedValue(undefined);

      await imagenService.eliminar(1);

      expect(LocalStorageHelper.eliminar).toHaveBeenCalledWith('imagenes/test.jpg');
      expect(mockImagenRepository.eliminar).toHaveBeenCalledWith(1);
    });
  });
});
