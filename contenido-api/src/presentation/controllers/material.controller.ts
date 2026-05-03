import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { PermisosGuard } from '../../infrastructure/guards/permisos.guard';
import { RequierePermiso } from '../decorators/requiere-permiso.decorator';
import { MaterialService } from '../../application/services/material.service';
import { GetUser } from '../decorators/get-user.decorator';
import type { UsuarioAutenticado } from '../decorators/get-user.decorator';
import { ActualizarMaterialDto } from '../../domain/dtos/material.dto';

@Controller('materiales')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  obtenerTodos() {
    return this.materialService.obtenerTodos();
  }

  @Get('seccion/:seccionId')
  obtenerPorSeccion(@Param('seccionId') seccionId: string) {
    return this.materialService.obtenerPorSeccion(Number(seccionId));
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.materialService.obtenerPorId(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  @UseInterceptors(FileInterceptor('archivo', { storage: memoryStorage() }))
  subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: { nombre?: string; descripcion?: string; seccionId?: string; orden?: string },
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.materialService.subir(
      archivo,
      usuario.id,
      body.nombre ?? '',
      body.descripcion,
      body.seccionId ? Number(body.seccionId) : undefined,
      body.orden ? Number(body.orden) : undefined,
    );
  }

  @Put(':id')
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarMaterialDto,
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.materialService.actualizar(Number(id), dto, usuario.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  async eliminar(@Param('id') id: string) {
    await this.materialService.eliminar(Number(id));
    return { mensaje: 'Material eliminado correctamente' };
  }
}
