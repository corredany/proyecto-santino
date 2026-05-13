import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { prisma } from '../../infrastructure/database/prisma';

@Injectable()
export class LimpiezaService {
  private readonly logger = new Logger(LimpiezaService.name);

  @Cron(CronExpression.EVERY_2_MINUTES)
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
      this.logger.error(`Limpieza interrumpida por fallo en BD: ${(error as Error).message}`);
    }
  }
}
