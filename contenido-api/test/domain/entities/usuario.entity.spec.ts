import { Usuario } from '../../../src/domain/entities/usuario.entity';

describe('Usuario Entity', () => {
  it('debe retornar true si el usuario tiene el rol indicado', () => {
    const usuario = new Usuario({ rolId: 1 });
    expect(usuario.tieneRol(1)).toBe(true);
  });

  it('debe retornar false si el usuario no tiene el rol indicado', () => {
    const usuario = new Usuario({ rolId: 1 });
    expect(usuario.tieneRol(2)).toBe(false);
  });
});