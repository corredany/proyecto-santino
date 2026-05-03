import { Injectable, Inject } from '@nestjs/common';
import type { ISeccionRepository } from '../../domain/interfaces/seccion.repository.interface';
import { SECCION_REPOSITORY } from '../../domain/tokens';
import { Seccion } from '../../domain/entities/seccion.entity';
import { CrearSeccionDto, ActualizarSeccionDto, ActualizarOrdenDto } from '../../domain/dtos/seccion.dto';
import {
  SeccionNoEncontradaException,
  SeccionFijaException,
} from '../../domain/exceptions/seccion.exception';

@Injectable()
export class SeccionService {
  constructor(
    @Inject(SECCION_REPOSITORY)
    private readonly seccionRepository: ISeccionRepository,
  ) {}

  async obtenerTodos(): Promise<Seccion[]> {
    return this.seccionRepository.encontrarTodos();
  }

  async obtenerVisibles(): Promise<Seccion[]> {
    return this.seccionRepository.encontrarVisibles();
  }

  async obtenerPorId(id: number): Promise<Seccion> {
    const seccion = await this.seccionRepository.encontrarPorId(id);
    if (!seccion) throw new SeccionNoEncontradaException(id);
    return seccion;
  }

  async crear(dto: CrearSeccionDto, usuarioId: number): Promise<Seccion> {
    return this.seccionRepository.crear({
      ...dto,
      esFija: false,
      visible: true,
      creadoPor: usuarioId,
      actualizadoPor: usuarioId,
    });
  }

  async actualizar(id: number, dto: ActualizarSeccionDto, usuarioId: number): Promise<Seccion> {
    await this.obtenerPorId(id);
    return this.seccionRepository.actualizar(id, { ...dto, actualizadoPor: usuarioId });
  }

  async actualizarOrden(secciones: ActualizarOrdenDto[]): Promise<void> {
    return this.seccionRepository.actualizarOrden(secciones);
  }

  async toggleVisible(id: number, usuarioId: number): Promise<Seccion> {
    const seccion = await this.obtenerPorId(id);
    return this.seccionRepository.actualizar(id, {
      visible: !seccion.visible,
      actualizadoPor: usuarioId,
    });
  }

  async eliminar(id: number): Promise<void> {
    const seccion = await this.obtenerPorId(id);
    if (!seccion.puedeEliminarse()) throw new SeccionFijaException();
    return this.seccionRepository.eliminar(id);
  }
}
