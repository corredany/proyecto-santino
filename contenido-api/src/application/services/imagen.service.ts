import { Injectable, Inject } from '@nestjs/common';
import type { IImagenRepository } from '../../domain/interfaces/imagen.repository.interface';
import { IMAGEN_REPOSITORY } from '../../domain/tokens';
import { Imagen } from '../../domain/entities/imagen.entity';
import { LocalStorageHelper } from '../../infrastructure/helpers/local-storage.helper';
import { ActualizarImagenDto } from '../../domain/dtos/imagen.dto';
import { ImagenNoEncontradaException, ErrorSubidaImagenException } from '../../domain/exceptions/imagen.exception';

@Injectable()
export class ImagenService {
  constructor(
    @Inject(IMAGEN_REPOSITORY)
    private readonly imagenRepository: IImagenRepository,
  ) {}

  async obtenerTodos(): Promise<Imagen[]> {
    return this.imagenRepository.encontrarTodos();
  }

  async obtenerPorSeccion(seccionId: number): Promise<Imagen[]> {
    return this.imagenRepository.encontrarPorSeccion(seccionId);
  }

  async obtenerPorId(id: number): Promise<Imagen> {
    const imagen = await this.imagenRepository.encontrarPorId(id);
    if (!imagen) throw new ImagenNoEncontradaException(id);
    return imagen;
  }

  async subir(
    archivo: Express.Multer.File,
    usuarioId: number,
    seccionId?: number,
    orden?: number,
  ): Promise<Imagen> {
    try {
      const { url, rutaArchivo } = await LocalStorageHelper.guardar(archivo, 'imagenes');
      return this.imagenRepository.crear({
        url,
        rutaArchivo,
        seccionId: seccionId || null,
        orden: orden || 0,
        creadoPor: usuarioId,
        actualizadoPor: usuarioId,
      });
    } catch {
      throw new ErrorSubidaImagenException();
    }
  }

  async actualizar(id: number, dto: ActualizarImagenDto, usuarioId: number): Promise<Imagen> {
    await this.obtenerPorId(id);
    return this.imagenRepository.actualizar(id, { ...dto, actualizadoPor: usuarioId });
  }

  async eliminar(id: number): Promise<void> {
    const imagen = await this.obtenerPorId(id);
    await LocalStorageHelper.eliminar(imagen.rutaArchivo);
    return this.imagenRepository.eliminar(id);
  }
}
