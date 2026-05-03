import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

export class LocalStorageHelper {
  private static readonly BASE = join(process.cwd(), 'uploads');

  static async guardar(
    archivo: Express.Multer.File,
    carpeta: string,
  ): Promise<{ url: string; rutaArchivo: string }> {
    const dir = join(this.BASE, carpeta);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const ext = archivo.originalname.split('.').pop() ?? 'bin';
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(join(dir, filename), archivo.buffer);

    const apiUrl = process.env.API_URL ?? 'http://localhost:3000';
    return {
      url: `${apiUrl}/uploads/${carpeta}/${filename}`,
      rutaArchivo: `${carpeta}/${filename}`,
    };
  }

  static async eliminar(rutaArchivo: string): Promise<void> {
    try {
      await unlink(join(this.BASE, rutaArchivo));
    } catch {
      // El archivo ya no existe, no es error crítico
    }
  }
}
