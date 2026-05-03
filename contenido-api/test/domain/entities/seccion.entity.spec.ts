import { Seccion } from '../../../src/domain/entities/seccion.entity';

describe('Seccion Entity', () => {
  it('debe poder eliminarse si no es fija', () => {
    const seccion = new Seccion({ esFija: false });
    expect(seccion.puedeEliminarse()).toBe(true);
  });

  it('no debe poder eliminarse si es fija', () => {
    const seccion = new Seccion({ esFija: true });
    expect(seccion.puedeEliminarse()).toBe(false);
  });

  it('siempre debe poder ocultarse', () => {
    const seccion = new Seccion({ esFija: true });
    expect(seccion.puedeOcultarse()).toBe(true);
  });
});