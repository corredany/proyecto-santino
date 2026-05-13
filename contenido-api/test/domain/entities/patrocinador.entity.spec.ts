import { Patrocinador } from '../../../src/domain/entities/patrocinador.entity';

describe('Patrocinador Entity', () => {
  it('debe asignar todas las propiedades desde el constructor', () => {
    const fecha = new Date();
    const patrocinador = new Patrocinador({
      id: 1,
      nombre: 'Empresa ABC',
      url: 'http://localhost:3000/uploads/patrocinadores/logo.png',
      rutaArchivo: 'patrocinadores/logo.png',
      orden: 0,
      creadoPor: 1,
      actualizadoPor: 1,
      creadoEn: fecha,
      actualizadoEn: fecha,
    });

    expect(patrocinador.id).toBe(1);
    expect(patrocinador.nombre).toBe('Empresa ABC');
    expect(patrocinador.url).toBe('http://localhost:3000/uploads/patrocinadores/logo.png');
    expect(patrocinador.rutaArchivo).toBe('patrocinadores/logo.png');
    expect(patrocinador.orden).toBe(0);
    expect(patrocinador.creadoPor).toBe(1);
    expect(patrocinador.actualizadoPor).toBe(1);
    expect(patrocinador.creadoEn).toBe(fecha);
    expect(patrocinador.actualizadoEn).toBe(fecha);
  });

  it('debe aceptar creadoPor y actualizadoPor como null', () => {
    const patrocinador = new Patrocinador({ creadoPor: null, actualizadoPor: null });
    expect(patrocinador.creadoPor).toBeNull();
    expect(patrocinador.actualizadoPor).toBeNull();
  });

  it('debe permitir construcción parcial', () => {
    const patrocinador = new Patrocinador({ id: 3, nombre: 'Patrocinador X' });
    expect(patrocinador.id).toBe(3);
    expect(patrocinador.nombre).toBe('Patrocinador X');
    expect(patrocinador.url).toBeUndefined();
  });
});
