import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { PermisosGuard } from '../../infrastructure/guards/permisos.guard';
import { RequierePermiso } from '../decorators/requiere-permiso.decorator';
import { PatrocinadorService } from '../../application/services/patrocinador.service';
import { GetUser } from '../decorators/get-user.decorator';
import type { UsuarioAutenticado } from '../decorators/get-user.decorator';
import { CrearPatrocinadorDto, ActualizarPatrocinadorDto } from '../../domain/dtos/patrocinador.dto';

@Controller('patrocinadores')
export class PatrocinadorController {
  constructor(private readonly patrocinadorService: PatrocinadorService) {}

  @Get()
  obtenerTodos() {
    return this.patrocinadorService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.patrocinadorService.obtenerPorId(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  @UseInterceptors(FileInterceptor('logo', { storage: memoryStorage() }))
  crear(
    @UploadedFile() logo: Express.Multer.File,
    @Body() dto: CrearPatrocinadorDto,
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.patrocinadorService.crear(logo, dto, usuario.id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarPatrocinadorDto,
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.patrocinadorService.actualizar(Number(id), dto, usuario.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PermisosGuard)
  @RequierePermiso('contenido:gestionar')
  async eliminar(@Param('id') id: string) {
    await this.patrocinadorService.eliminar(Number(id));
    return { mensaje: 'Patrocinador eliminado correctamente' };
  }
}
