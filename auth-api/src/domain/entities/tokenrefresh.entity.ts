export class TokenRefresh {
  id: number;
  token: string;
  usuarioId: number;
  expiraEn: Date;
  revocado: boolean;
  revocadoEn: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
  creadoEn: Date;

  constructor(data: Partial<TokenRefresh>) {
    Object.assign(this, data);
  }

  estaVigente(): boolean {
    return !this.revocado && this.expiraEn > new Date();
  }
}