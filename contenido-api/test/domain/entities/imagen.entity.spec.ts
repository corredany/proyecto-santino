import { Imagen } from '../../../src/domain/entities/imagen.entity';

describe('Imagen Entity', () => {
  it('debe asignar todas las propiedades desde el constructor', () => {
    const fecha = new Date();
    const imagen = new Imagen({
      id: 1,
      url: 'http://localhost:3000/uploads/imagenes/foto.jpg',
      rutaArchivo: 'imagenes/foto.jpg',
      orden: 2,
      seccionId: 3,
      creadoPor: 1,
      actualizadoPor: 1,
      creadoEn: fecha,
      actualizadoEn: fecha,
    });

    expect(imagen.id).toBe(1);
    expect(imagen.url).toBe('http://localhost:3000/uploads/imagenes/foto.jpg');
    expect(imagen.rutaArchivo).toBe('imagenes/foto.jpg');
    expect(imagen.orden).toBe(2);
    expect(imagen.seccionId).toBe(3);
    expect(imagen.creadoPor).toBe(1);
    expect(imagen.actualizadoPor).toBe(1);
    expect(imagen.creadoEn).toBe(fecha);
    expect(imagen.actualizadoEn).toBe(fecha);
  });

  it('debe aceptar seccionId como null', () => {
    const imagen = new Imagen({ seccionId: null });
    expect(imagen.seccionId).toBeNull();
  });

  it('debe aceptar creadoPor y actualizadoPor como null', () => {
    const imagen = new Imagen({ creadoPor: null, actualizadoPor: null });
    expect(imagen.creadoPor).toBeNull();
    expect(imagen.actualizadoPor).toBeNull();
  });

  it('debe permitir construcción parcial', () => {
    const imagen = new Imagen({ id: 5, orden: 0 });
    expect(imagen.id).toBe(5);
    expect(imagen.orden).toBe(0);
    expect(imagen.url).toBeUndefined();
  });
});
