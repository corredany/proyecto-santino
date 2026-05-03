import { TokenRefresco } from '../../../src/domain/entities/token-refresco.entity';

describe('TokenRefresco Entity', () => {
  it('debe estar vigente si no está revocado y no ha expirado', () => {
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    const token = new TokenRefresco({ revocado: false, expiraEn });
    expect(token.estaVigente()).toBe(true);
  });

  it('no debe estar vigente si está revocado', () => {
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    const token = new TokenRefresco({ revocado: true, expiraEn });
    expect(token.estaVigente()).toBe(false);
  });

  it('no debe estar vigente si ha expirado', () => {
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() - 1);

    const token = new TokenRefresco({ revocado: false, expiraEn });
    expect(token.estaVigente()).toBe(false);
  });

  it('debe estar revocado si revocado es true', () => {
    const token = new TokenRefresco({ revocado: true });
    expect(token.estaRevocado()).toBe(true);
  });
});