import { Injectable, Inject } from '@nestjs/common';
import type { IMaterialRepository } from '../../domain/interfaces/material.repository.interface';
import { MATERIAL_REPOSITORY } from '../../domain/tokens';
import { Material } from '../../domain/entities/material.entity';
import { LocalStorageHelper } from '../../infrastructure/helpers/local-storage.helper';
import { ActualizarMaterialDto } from '../../domain/dtos/material.dto';
import { MaterialNoEncontradoException, ErrorSubidaMaterialException } from '../../domain/exceptions/material.exception';

@Injectable()
export class MaterialService {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
  ) {}

  async obtenerTodos(): Promise<Material[]> {
    return this.materialRepository.encontrarTodos();
  }

  async obtenerPorSeccion(seccionId: number): Promise<Material[]> {
    return this.materialRepository.encontrarPorSeccion(seccionId);
  }

  async obtenerPorId(id: number): Promise<Material> {
    const material = await this.materialRepository.encontrarPorId(id);
    if (!material) throw new MaterialNoEncontradoException(id);
    return material;
  }

  async subir(
    archivo: Express.Multer.File,
    usuarioId: number,
    nombre: string,
    descripcion?: string,
    seccionId?: number,
    orden?: number,
  ): Promise<Material> {
    try {
      const { url, rutaArchivo } = await LocalStorageHelper.guardar(archivo, 'materiales');
      return this.materialRepository.crear({
        nombre,
        descripcion: descripcion || null,
        url,
        rutaArchivo,
        seccionId: seccionId || null,
        orden: orden || 0,
        creadoPor: usuarioId,
        actualizadoPor: usuarioId,
      });
    } catch {
      throw new ErrorSubidaMaterialException();
    }
  }

  async actualizar(id: number, dto: ActualizarMaterialDto, usuarioId: number): Promise<Material> {
    await this.obtenerPorId(id);
    return this.materialRepository.actualizar(id, { ...dto, actualizadoPor: usuarioId });
  }

  async eliminar(id: number): Promise<void> {
    const material = await this.obtenerPorId(id);
    await LocalStorageHelper.eliminar(material.rutaArchivo);
    return this.materialRepository.eliminar(id);
  }
}
