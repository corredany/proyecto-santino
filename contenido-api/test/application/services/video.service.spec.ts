import { VideoService } from '../../../src/application/services/video.service';
import { Video } from '../../../src/domain/entities/video.entity';
import {
  VideoNoEncontradoException,
  ErrorSubidaVideoException,
} from '../../../src/domain/exceptions/video.exception';
import { LocalStorageHelper } from '../../../src/infrastructure/helpers/local-storage.helper';

jest.mock('../../../src/infrastructure/helpers/local-storage.helper', () => ({
  LocalStorageHelper: {
    guardar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const mockVideoRepository = {
  encontrarTodos: jest.fn(),
  encontrarPorSeccion: jest.fn(),
  encontrarPorId: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

const videoMock = new Video({
  id: 1,
  url: 'http://localhost:3000/uploads/videos/test.mp4',
  rutaArchivo: 'videos/test.mp4',
  orden: 0,
  seccionId: 1,
  creadoPor: 1,
  actualizadoPor: 1,
});

const archivoMock = {
  originalname: 'video.mp4',
  buffer: Buffer.from('fake'),
  mimetype: 'video/mp4',
} as Express.Multer.File;

describe('VideoService', () => {
  let videoService: VideoService;

  beforeEach(() => {
    videoService = new VideoService(mockVideoRepository as any);
    jest.clearAllMocks();
  });

  describe('obtenerPorId', () => {
    it('debe lanzar excepción si el video no existe', async () => {
      mockVideoRepository.encontrarPorId.mockResolvedValue(null);
      await expect(videoService.obtenerPorId(999)).rejects.toThrow(VideoNoEncontradoException);
    });

    it('debe retornar el video si existe', async () => {
      mockVideoRepository.encontrarPorId.mockResolvedValue(videoMock);
      const resultado = await videoService.obtenerPorId(1);
      expect(resultado).toEqual(videoMock);
    });
  });

  describe('subir', () => {
    beforeEach(() => {
      (LocalStorageHelper.guardar as jest.Mock).mockResolvedValue({
        url: 'http://localhost:3000/uploads/videos/uuid.mp4',
        rutaArchivo: 'videos/uuid.mp4',
      });
      mockVideoRepository.crear.mockResolvedValue(videoMock);
    });

    it('debe guardar el archivo y crear el registro en BD', async () => {
      const resultado = await videoService.subir(archivoMock, 1, 1, 0);
      expect(LocalStorageHelper.guardar).toHaveBeenCalledWith(archivoMock, 'videos');
      expect(mockVideoRepository.crear).toHaveBeenCalled();
      expect(resultado).toEqual(videoMock);
    });

    it('debe pasar el usuarioId como creadoPor y actualizadoPor', async () => {
      await videoService.subir(archivoMock, 42, 1, 0);
      expect(mockVideoRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ creadoPor: 42, actualizadoPor: 42 }),
      );
    });

    it('debe lanzar ErrorSubidaVideoException si falla el guardado del archivo', async () => {
      (LocalStorageHelper.guardar as jest.Mock).mockRejectedValue(new Error('IO error'));
      await expect(videoService.subir(archivoMock, 1, 1, 0)).rejects.toThrow(
        ErrorSubidaVideoException,
      );
    });
  });

  describe('actualizar', () => {
    it('debe lanzar excepción si el video no existe', async () => {
      mockVideoRepository.encontrarPorId.mockResolvedValue(null);
      await expect(videoService.actualizar(999, {}, 1)).rejects.toThrow(VideoNoEncontradoException);
    });

    it('debe actualizar el video e incluir actualizadoPor', async () => {
      mockVideoRepository.encontrarPorId.mockResolvedValue(videoMock);
      mockVideoRepository.actualizar.mockResolvedValue({ ...videoMock, orden: 3 });

      const resultado = await videoService.actualizar(1, { orden: 3 }, 2);

      expect(mockVideoRepository.actualizar).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ orden: 3, actualizadoPor: 2 }),
      );
      expect(resultado.orden).toBe(3);
    });
  });

  describe('eliminar', () => {
    it('debe lanzar excepción si el video no existe', async () => {
      mockVideoRepository.encontrarPorId.mockResolvedValue(null);
      await expect(videoService.eliminar(999)).rejects.toThrow(VideoNoEncontradoException);
    });

    it('debe eliminar el archivo del disco y el registro de BD', async () => {
      mockVideoRepository.encontrarPorId.mockResolvedValue(videoMock);
      (LocalStorageHelper.eliminar as jest.Mock).mockResolvedValue(undefined);
      mockVideoRepository.eliminar.mockResolvedValue(undefined);

      await videoService.eliminar(1);

      expect(LocalStorageHelper.eliminar).toHaveBeenCalledWith('videos/test.mp4');
      expect(mockVideoRepository.eliminar).toHaveBeenCalledWith(1);
    });
  });
});
