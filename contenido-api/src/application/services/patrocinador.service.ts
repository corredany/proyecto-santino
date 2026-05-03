import { Injectable, Inject } from '@nestjs/common';
import type { IPatrocinadorRepository } from '../../domain/interfaces/patrocinador.repository.interface';
import { PATROCINADOR_REPOSITORY } from '../../domain/tokens';
import { Patrocinador } from '../../domain/entities/patrocinador.entity';
import { LocalStorageHelper } from '../../infrastructure/helpers/local-storage.helper';
import { CrearPatrocinadorDto, ActualizarPatrocinadorDto } from '../../domain/dtos/patrocinador.dto';
import { PatrocinadorNoEncontradoException, ErrorSubidaPatrocinadorException } from '../../domain/exceptions/patrocinador.exception';

@Injectable()
export class PatrocinadorService {
  constructor(
    @Inject(PATROCINADOR_REPOSITORY)
    private readonly patrocinadorRepository: IPatrocinadorRepository,
  ) {}

  async obtenerTodos(): Promise<Patrocinador[]> {
    return this.patrocinadorRepository.encontrarTodos();
  }

  async obtenerPorId(id: number): Promise<Patrocinador> {
    const patrocinador = await this.patrocinadorRepository.encontrarPorId(id);
    if (!patrocinador) throw new PatrocinadorNoEncontradoException(id);
    return patrocinador;
  }

  async crear(
    archivo: Express.Multer.File,
    dto: CrearPatrocinadorDto,
    usuarioId: number,
  ): Promise<Patrocinador> {
    try {
      const { url, rutaArchivo } = await LocalStorageHelper.guardar(archivo, 'patrocinadores');
      return this.patrocinadorRepository.crear({
        nombre: dto.nombre,
        url,
        rutaArchivo,
        orden: dto.orden || 0,
        creadoPor: usuarioId,
        actualizadoPor: usuarioId,
      });
    } catch {
      throw new ErrorSubidaPatrocinadorException();
    }
  }

  async actualizar(id: number, dto: ActualizarPatrocinadorDto, usuarioId: number): Promise<Patrocinador> {
    await this.obtenerPorId(id);
    return this.patrocinadorRepository.actualizar(id, { ...dto, actualizadoPor: usuarioId });
  }

  async eliminar(id: number): Promise<void> {
    const patrocinador = await this.obtenerPorId(id);
    await LocalStorageHelper.eliminar(patrocinador.rutaArchivo);
    return this.patrocinadorRepository.eliminar(id);
  }
}
