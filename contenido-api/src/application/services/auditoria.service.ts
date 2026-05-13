import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { prisma } from '../../infrastructure/database/prisma';

const PATRONES_SOSPECHOSOS = [
  /\.\.[/\\]/,          // path traversal: ../../
  /<script/i,           // XSS: <script>
  /javascript:/i,       // XSS: javascript:
  /on\w+\s*=/i,         // XSS: onerror= onclick=
  /[;|&`$(){}[\]]/,     // inyección de comandos
];

function esSospechoso(valor: string | null | undefined): boolean {
  if (!valor) return false;
  return PATRONES_SOSPECHOSOS.some((patron) => patron.test(valor));
}

@Injectable()
export class AuditoriaService {
  private readonly logger = new Logger(AuditoriaService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async auditarContenido() {
    this.logger.log('Iniciando auditoría de contenido...');

    try {
      await this.auditarImagenes();
      await this.auditarVideos();
      this.logger.log('Auditoría completada.');
    } catch (error) {
      // Punto 8: si la réplica/BD no responde, registra y continúa sin tronar
      this.logger.error(`Auditoría interrumpida por fallo en BD: ${(error as Error).message}`);
    }
  }

  private async auditarImagenes() {
    const imagenes = await prisma.imagen.findMany({
      select: { id: true, url: true, rutaArchivo: true },
    });

    for (const imagen of imagenes) {
      const camposSospechosos: string[] = [];

      if (esSospechoso(imagen.url))         camposSospechosos.push(`url="${imagen.url}"`);
      if (esSospechoso(imagen.rutaArchivo)) camposSospechosos.push(`rutaArchivo="${imagen.rutaArchivo}"`);

      if (camposSospechosos.length > 0) {
        // Punto 7: identifica el dato vulnerable, lo registra y lo omite
        this.logger.warn(
          `[IMAGEN id=${imagen.id}] Datos sospechosos detectados: ${camposSospechosos.join(', ')} — omitido.`,
        );
      }
    }
  }

  private async auditarVideos() {
    const videos = await prisma.video.findMany({
      select: { id: true, url: true, rutaArchivo: true },
    });

    for (const video of videos) {
      const camposSospechosos: string[] = [];

      if (esSospechoso(video.url))         camposSospechosos.push(`url="${video.url}"`);
      if (esSospechoso(video.rutaArchivo)) camposSospechosos.push(`rutaArchivo="${video.rutaArchivo}"`);

      if (camposSospechosos.length > 0) {
        this.logger.warn(
          `[VIDEO id=${video.id}] Datos sospechosos detectados: ${camposSospechosos.join(', ')} — omitido.`,
        );
      }
    }
  }
}
