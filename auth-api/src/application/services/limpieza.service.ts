import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { prisma } from '../../infrastructure/database/prisma';

@Injectable()
export class LimpiezaService {
  private readonly logger = new Logger(LimpiezaService.name);

  @Cron('0 */2 * * * *')
  async limpiarTokensExpirados() {
    this.logger.log('Iniciando limpieza de tokens de refresco...');

    try {
      const resultado = await prisma.tokenRefresco.deleteMany({
        where: {
          OR: [
            { expiraEn: { lt: new Date() } },
            { revocado: true },
          ],
        },
      });

      this.logger.log(`Limpieza completada. Tokens eliminados: ${resultado.count}`);
    } catch (error) {
      const msg = (error as Error).message;
      if (msg.includes('P1001') || msg.includes('P1002') || msg.includes('connect')) {
        this.logger.warn('Limpieza omitida — base de datos no disponible (réplica posiblemente caída). Se reintentará en el siguiente ciclo.');
      } else {
        this.logger.error(`Limpieza interrumpida por fallo en BD: ${msg}`);
      }
    }
  }
}
