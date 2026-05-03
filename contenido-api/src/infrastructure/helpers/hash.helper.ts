import * as bcrypt from 'bcrypt';

export class HashHelper {
  private static readonly SALT_ROUNDS = 10;

  static async encriptar(texto: string): Promise<string> {
    return bcrypt.hash(texto, this.SALT_ROUNDS);
  }

  static async verificar(texto: string, hash: string): Promise<boolean> {
    return bcrypt.compare(texto, hash);
  }
}