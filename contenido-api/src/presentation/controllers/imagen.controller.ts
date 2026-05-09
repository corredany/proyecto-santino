import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { memoryStorage } from 'multer';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { PermisosGuard } from '../../infrastructure/guards/permisos.guard';
import { RequierePermiso } from '../decorators/requiere-permiso.decorator';
import { ImagenService } from '../../application/services/imagen.service';
import { GetUser } from '../decorators/get-user.decorator';
import type { UsuarioAutenticado } from '../decorators/get-user.decorator';
import { ActualizarImagenDto } from '../../domain/dtos/imagen.dto';

@Controller('imagenes')
export class ImagenController {
  constructor(private readonly imagenService: ImagenService) {}

  @Get()
  obtenerTodos() {
    return this.imagenService.obtenerTodos();
  }

  @Get('seccion/:seccionId')
  obtenerPorSeccion(@Param('seccionId') seccionId: string) {
    return this.imagenService.obtenerPorSeccion(Number(seccionId));
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.imagenService.obtenerPorId(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  @Throttle({ upload: { ttl: 60000, limit: 10 } })
  @UseInterceptors(FileInterceptor('archivo', {
    storage: memoryStorage(),
    fileFilter: (_req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se permiten imágenes (jpeg, png, gif, webp)'), false);
      }
    },
  }))
  subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: { seccionId?: string; orden?: string },
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.imagenService.subir(
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
    @Body() dto: ActualizarImagenDto,
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.imagenService.actualizar(Number(id), dto, usuario.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  async eliminar(@Param('id') id: string) {
    await this.imagenService.eliminar(Number(id));
    return { mensaje: 'Imagen eliminada correctamente' };
  }
}
