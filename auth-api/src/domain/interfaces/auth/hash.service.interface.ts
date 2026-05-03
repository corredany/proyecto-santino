export interface IHashService {
  encriptar(texto: string): Promise<string>;
  verificar(texto: string, hash: string): Promise<boolean>;
}