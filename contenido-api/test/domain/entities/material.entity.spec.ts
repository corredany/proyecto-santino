import { Material } from '../../../src/domain/entities/material.entity';

describe('Material Entity', () => {
  it('debe asignar todas las propiedades desde el constructor', () => {
    const fecha = new Date();
    const material = new Material({
      id: 1,
      nombre: 'Guía de cocina',
      descripcion: 'Descripción del material',
      url: 'http://localhost:3000/uploads/materiales/guia.pdf',
      rutaArchivo: 'materiales/guia.pdf',
      orden: 1,
      seccionId: 2,
      creadoPor: 1,
      actualizadoPor: 1,
      creadoEn: fecha,
      actualizadoEn: fecha,
    });

    expect(material.id).toBe(1);
    expect(material.nombre).toBe('Guía de cocina');
    expect(material.descripcion).toBe('Descripción del material');
    expect(material.url).toBe('http://localhost:3000/uploads/materiales/guia.pdf');
    expect(material.rutaArchivo).toBe('materiales/guia.pdf');
    expect(material.orden).toBe(1);
    expect(material.seccionId).toBe(2);
    expect(material.creadoPor).toBe(1);
    expect(material.actualizadoPor).toBe(1);
    expect(material.creadoEn).toBe(fecha);
    expect(material.actualizadoEn).toBe(fecha);
  });

  it('debe aceptar descripcion como null', () => {
    const material = new Material({ descripcion: null });
    expect(material.descripcion).toBeNull();
  });

  it('debe aceptar seccionId como null', () => {
    const material = new Material({ seccionId: null });
    expect(material.seccionId).toBeNull();
  });

  it('debe aceptar creadoPor y actualizadoPor como null', () => {
    const material = new Material({ creadoPor: null, actualizadoPor: null });
    expect(material.creadoPor).toBeNull();
    expect(material.actualizadoPor).toBeNull();
  });

  it('debe permitir construcción parcial', () => {
    const material = new Material({ id: 2, nombre: 'Recetario' });
    expect(material.id).toBe(2);
    expect(material.nombre).toBe('Recetario');
    expect(material.url).toBeUndefined();
  });
});
