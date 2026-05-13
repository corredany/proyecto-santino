import { MaterialService } from '../../../src/application/services/material.service';
import { Material } from '../../../src/domain/entities/material.entity';
import {
  MaterialNoEncontradoException,
  ErrorSubidaMaterialException,
} from '../../../src/domain/exceptions/material.exception';
import { LocalStorageHelper } from '../../../src/infrastructure/helpers/local-storage.helper';

jest.mock('../../../src/infrastructure/helpers/local-storage.helper', () => ({
  LocalStorageHelper: {
    guardar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const mockMaterialRepository = {
  encontrarTodos: jest.fn(),
  encontrarPorSeccion: jest.fn(),
  encontrarPorId: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

const materialMock = new Material({
  id: 1,
  nombre: 'Guía de cocina',
  descripcion: 'Descripción del material',
  url: 'http://localhost:3000/uploads/materiales/guia.pdf',
  rutaArchivo: 'materiales/guia.pdf',
  orden: 0,
  seccionId: 1,
  creadoPor: 1,
  actualizadoPor: 1,
});

const archivoMock = {
  originalname: 'guia.pdf',
  buffer: Buffer.from('fake'),
  mimetype: 'application/pdf',
} as Express.Multer.File;

describe('MaterialService', () => {
  let materialService: MaterialService;

  beforeEach(() => {
    materialService = new MaterialService(mockMaterialRepository as any);
    jest.clearAllMocks();
  });

  describe('obtenerTodos', () => {
    it('debe retornar todos los materiales', async () => {
      mockMaterialRepository.encontrarTodos.mockResolvedValue([materialMock]);
      const resultado = await materialService.obtenerTodos();
      expect(resultado).toEqual([materialMock]);
    });
  });

  describe('obtenerPorSeccion', () => {
    it('debe retornar los materiales de la sección indicada', async () => {
      mockMaterialRepository.encontrarPorSeccion.mockResolvedValue([materialMock]);
      const resultado = await materialService.obtenerPorSeccion(1);
      expect(resultado).toEqual([materialMock]);
      expect(mockMaterialRepository.encontrarPorSeccion).toHaveBeenCalledWith(1);
    });
  });

  describe('obtenerPorId', () => {
    it('debe lanzar excepción si el material no existe', async () => {
      mockMaterialRepository.encontrarPorId.mockResolvedValue(null);
      await expect(materialService.obtenerPorId(999)).rejects.toThrow(
        MaterialNoEncontradoException,
      );
    });

    it('debe retornar el material si existe', async () => {
      mockMaterialRepository.encontrarPorId.mockResolvedValue(materialMock);
      const resultado = await materialService.obtenerPorId(1);
      expect(resultado).toEqual(materialMock);
    });
  });

  describe('subir', () => {
    beforeEach(() => {
      (LocalStorageHelper.guardar as jest.Mock).mockResolvedValue({
        url: 'http://localhost:3000/uploads/materiales/guia.pdf',
        rutaArchivo: 'materiales/guia.pdf',
      });
      mockMaterialRepository.crear.mockResolvedValue(materialMock);
    });

    it('debe guardar el archivo y crear el registro en BD', async () => {
      const resultado = await materialService.subir(archivoMock, 1, 'Guía de cocina');
      expect(LocalStorageHelper.guardar).toHaveBeenCalledWith(archivoMock, 'materiales');
      expect(mockMaterialRepository.crear).toHaveBeenCalled();
      expect(resultado).toEqual(materialMock);
    });

    it('debe pasar el usuarioId como creadoPor y actualizadoPor', async () => {
      await materialService.subir(archivoMock, 42, 'Guía');
      expect(mockMaterialRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ creadoPor: 42, actualizadoPor: 42 }),
      );
    });

    it('debe usar null como descripcion cuando no se proporciona', async () => {
      await materialService.subir(archivoMock, 1, 'Guía');
      expect(mockMaterialRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ descripcion: null }),
      );
    });

    it('debe usar null como seccionId cuando no se proporciona', async () => {
      await materialService.subir(archivoMock, 1, 'Guía');
      expect(mockMaterialRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ seccionId: null }),
      );
    });

    it('debe usar el orden cuando se proporciona uno positivo', async () => {
      await materialService.subir(archivoMock, 1, 'Guía', undefined, undefined, 5);
      expect(mockMaterialRepository.crear).toHaveBeenCalledWith(
        expect.objectContaining({ orden: 5 }),
      );
    });

    it('debe lanzar ErrorSubidaMaterialException si falla el guardado', async () => {
      (LocalStorageHelper.guardar as jest.Mock).mockRejectedValue(new Error('IO error'));
      await expect(
        materialService.subir(archivoMock, 1, 'Guía'),
      ).rejects.toThrow(ErrorSubidaMaterialException);
    });
  });

  describe('actualizar', () => {
    it('debe lanzar excepción si el material no existe', async () => {
      mockMaterialRepository.encontrarPorId.mockResolvedValue(null);
      await expect(materialService.actualizar(999, { nombre: 'Nuevo' }, 1)).rejects.toThrow(
        MaterialNoEncontradoException,
      );
    });

    it('debe actualizar el material e incluir actualizadoPor', async () => {
      mockMaterialRepository.encontrarPorId.mockResolvedValue(materialMock);
      mockMaterialRepository.actualizar.mockResolvedValue({
        ...materialMock,
        nombre: 'Nuevo Nombre',
      });
      const resultado = await materialService.actualizar(1, { nombre: 'Nuevo Nombre' }, 2);
      expect(mockMaterialRepository.actualizar).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ nombre: 'Nuevo Nombre', actualizadoPor: 2 }),
      );
      expect(resultado.nombre).toBe('Nuevo Nombre');
    });
  });

  describe('eliminar', () => {
    it('debe lanzar excepción si el material no existe', async () => {
      mockMaterialRepository.encontrarPorId.mockResolvedValue(null);
      await expect(materialService.eliminar(999)).rejects.toThrow(
        MaterialNoEncontradoException,
      );
    });

    it('debe eliminar el archivo del disco y el registro de BD', async () => {
      mockMaterialRepository.encontrarPorId.mockResolvedValue(materialMock);
      (LocalStorageHelper.eliminar as jest.Mock).mockResolvedValue(undefined);
      mockMaterialRepository.eliminar.mockResolvedValue(undefined);

      await materialService.eliminar(1);

      expect(LocalStorageHelper.eliminar).toHaveBeenCalledWith('materiales/guia.pdf');
      expect(mockMaterialRepository.eliminar).toHaveBeenCalledWith(1);
    });
  });
});
