import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { PermisosGuard } from '../../infrastructure/guards/permisos.guard';
import { RequierePermiso } from '../decorators/requiere-permiso.decorator';
import { VideoService } from '../../application/services/video.service';
import { GetUser } from '../decorators/get-user.decorator';
import type { UsuarioAutenticado } from '../decorators/get-user.decorator';
import { ActualizarVideoDto } from '../../domain/dtos/video.dto';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  obtenerTodos() {
    return this.videoService.obtenerTodos();
  }

  @Get('seccion/:seccionId')
  obtenerPorSeccion(@Param('seccionId') seccionId: string) {
    return this.videoService.obtenerPorSeccion(Number(seccionId));
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.videoService.obtenerPorId(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  @UseInterceptors(FileInterceptor('archivo', { storage: memoryStorage() }))
  subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: { seccionId?: string; orden?: string },
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.videoService.subir(
      archivo,
      usuario.id,
      body.seccionId ? Number(body.seccionId) : undefined,
      body.orden ? Number(body.orden) : undefined,
    );
  }

  @Put(':id')
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarVideoDto,
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.videoService.actualizar(Number(id), dto, usuario.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  async eliminar(@Param('id') id: string) {
    await this.videoService.eliminar(Number(id));
    return { mensaje: 'Video eliminado correctamente' };
  }
}
