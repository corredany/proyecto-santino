import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { prisma } from '../../infrastructure/database/prisma';

const PATRONES_SOSPECHOSOS = [
  /\.\./,           // path traversal
  /\0/,             // null byte
  /^\/(?!app\/)/,   // ruta absoluta fuera de /app
  /<script/i,       // XSS en nombre de archivo
  /\.(php|exe|sh|bat|cmd|ps1)$/i,  // extensiones ejecutables
];

function esSospechosa(ruta: string): boolean {
  return PATRONES_SOSPECHOSOS.some((patron) => patron.test(ruta));
}

@Injectable()
export class LimpiezaContenidoService {
  private readonly logger = new Logger(LimpiezaContenidoService.name);

  @Cron('0 */5 * * * *')
  async escanearRutasSospechosas() {
    this.logger.log('Iniciando escaneo de rutas de archivos...');

    try {
      const [imagenes, videos, materiales, patrocinadores] = await Promise.all([
        prisma.imagen.findMany({ select: { id: true, rutaArchivo: true } }),
        prisma.video.findMany({ select: { id: true, rutaArchivo: true } }),
        prisma.material.findMany({ select: { id: true, rutaArchivo: true } }),
        prisma.patrocinador.findMany({ select: { id: true, rutaArchivo: true } }),
      ]);

      const registros = [
        ...imagenes.map((r) => ({ ...r, tipo: 'Imagen' })),
        ...videos.map((r) => ({ ...r, tipo: 'Video' })),
        ...materiales.map((r) => ({ ...r, tipo: 'Material' })),
        ...patrocinadores.map((r) => ({ ...r, tipo: 'Patrocinador' })),
      ];

      let omitidos = 0;

      for (const registro of registros) {
        if (esSospechosa(registro.rutaArchivo)) {
          this.logger.warn(
            `[${registro.tipo} id=${registro.id}] Ruta sospechosa detectada — omitida: "${registro.rutaArchivo}"`,
          );
          omitidos++;
          continue;
        }
      }

      this.logger.log(
        `Escaneo completado. Registros revisados: ${registros.length} | Sospechosos omitidos: ${omitidos}`,
      );
    } catch (error) {
      const msg = (error as Error).message;
      if (msg.includes('P1001') || msg.includes('P1002') || msg.includes('connect')) {
        this.logger.warn('Escaneo omitido — base de datos no disponible (réplica posiblemente caída)');
      } else {
        this.logger.error(`Escaneo interrumpido: ${msg}`);
      }
    }
  }
}
