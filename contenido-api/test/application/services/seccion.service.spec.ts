import { SeccionService } from '../../../src/application/services/seccion.service';
import { Seccion } from '../../../src/domain/entities/seccion.entity';
import { SeccionNoEncontradaException, SeccionFijaException } from '../../../src/domain/exceptions/seccion.exception';

const mockSeccionRepository = {
  encontrarTodos: jest.fn(),
  encontrarVisibles: jest.fn(),
  encontrarPorId: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  actualizarOrden: jest.fn(),
  eliminar: jest.fn(),
};

describe('SeccionService', () => {
  let seccionService: SeccionService;

  beforeEach(() => {
    seccionService = new SeccionService(mockSeccionRepository as any);
    jest.clearAllMocks();
  });

  describe('obtenerTodos', () => {
    it('debe retornar todas las secciones', async () => {
      const seccion = new Seccion({ id: 1, nombre: 'Cocinas' });
      mockSeccionRepository.encontrarTodos.mockResolvedValue([seccion]);
      const resultado = await seccionService.obtenerTodos();
      expect(resultado).toEqual([seccion]);
    });
  });

  describe('obtenerVisibles', () => {
    it('debe retornar solo las secciones visibles', async () => {
      const seccion = new Seccion({ id: 1, nombre: 'Cocinas', visible: true });
      mockSeccionRepository.encontrarVisibles.mockResolvedValue([seccion]);
      const resultado = await seccionService.obtenerVisibles();
      expect(resultado).toEqual([seccion]);
    });
  });

  describe('actualizar', () => {
    it('debe lanzar excepción si la sección no existe', async () => {
      mockSeccionRepository.encontrarPorId.mockResolvedValue(null);
      await expect(seccionService.actualizar(999, { nombre: 'Nueva' }, 1)).rejects.toThrow(
        SeccionNoEncontradaException,
      );
    });

    it('debe actualizar la sección si existe', async () => {
      const seccion = new Seccion({ id: 1, nombre: 'Cocinas', esFija: false });
      const actualizada = new Seccion({ id: 1, nombre: 'Nueva', esFija: false });
      mockSeccionRepository.encontrarPorId.mockResolvedValue(seccion);
      mockSeccionRepository.actualizar.mockResolvedValue(actualizada);
      const resultado = await seccionService.actualizar(1, { nombre: 'Nueva' }, 1);
      expect(resultado.nombre).toBe('Nueva');
    });
  });

  describe('actualizarOrden', () => {
    it('debe delegar la actualización de orden al repositorio', async () => {
      const secciones = [{ id: 1, orden: 2 }, { id: 2, orden: 1 }];
      mockSeccionRepository.actualizarOrden.mockResolvedValue(undefined);
      await seccionService.actualizarOrden(secciones);
      expect(mockSeccionRepository.actualizarOrden).toHaveBeenCalledWith(secciones);
    });
  });

  describe('obtenerPorId', () => {
    it('debe lanzar excepción si la sección no existe', async () => {
      mockSeccionRepository.encontrarPorId.mockResolvedValue(null);
      await expect(seccionService.obtenerPorId(999)).rejects.toThrow(
        SeccionNoEncontradaException,
      );
    });

    it('debe retornar la sección si existe', async () => {
      const seccion = new Seccion({ id: 1, nombre: 'Cocinas', esFija: false });
      mockSeccionRepository.encontrarPorId.mockResolvedValue(seccion);
      const resultado = await seccionService.obtenerPorId(1);
      expect(resultado).toEqual(seccion);
    });
  });

  describe('eliminar', () => {
    it('debe lanzar excepción si la sección es fija', async () => {
      const seccion = new Seccion({ id: 1, nombre: 'Inicio', esFija: true });
      mockSeccionRepository.encontrarPorId.mockResolvedValue(seccion);
      await expect(seccionService.eliminar(1)).rejects.toThrow(SeccionFijaException);
    });

    it('debe eliminar la sección si no es fija', async () => {
      const seccion = new Seccion({ id: 1, nombre: 'Cocinas', esFija: false });
      mockSeccionRepository.encontrarPorId.mockResolvedValue(seccion);
      mockSeccionRepository.eliminar.mockResolvedValue(undefined);
      await seccionService.eliminar(1);
      expect(mockSeccionRepository.eliminar).toHaveBeenCalledWith(1);
    });
  });

  describe('toggleVisible', () => {
    it('debe cambiar visible de true a false', async () => {
      const seccion = new Seccion({ id: 1, nombre: 'Cocinas', visible: true });
      mockSeccionRepository.encontrarPorId.mockResolvedValue(seccion);
      mockSeccionRepository.actualizar.mockResolvedValue(
        new Seccion({ ...seccion, visible: false }),
      );
      const resultado = await seccionService.toggleVisible(1);
      expect(resultado.visible).toBe(false);
    });
  });

  describe('crear', () => {
    it('debe crear una sección con esFija false y visible true', async () => {
      const dto = { nombre: 'Cocinas', orden: 1 };
      const seccionCreada = new Seccion({ id: 1, ...dto, esFija: false, visible: true });
      mockSeccionRepository.crear.mockResolvedValue(seccionCreada);
      const resultado = await seccionService.crear(dto);
      expect(resultado.esFija).toBe(false);
      expect(resultado.visible).toBe(true);
    });
  });
});