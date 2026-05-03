import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashService } from '../../domain/interfaces/auth/hash.service.interface';

@Injectable()
export class HashHelper implements IHashService {
  private static readonly SALT_ROUNDS = 10;

  async encriptar(texto: string): Promise<string> {
    return bcrypt.hash(texto, HashHelper.SALT_ROUNDS);
  }

  async verificar(texto: string, hash: string): Promise<boolean> {
    return bcrypt.compare(texto, hash);
  }
}