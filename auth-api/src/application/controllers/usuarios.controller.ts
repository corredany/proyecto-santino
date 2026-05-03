import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { PermisosGuard } from '../../infrastructure/guards/permisos.guard';
import { RequierePermiso } from '../../infrastructure/decorators/requiere-permiso.decorator';
import { ObtenerUsuariosUseCase } from '../logic/usuarios/obtener-usuarios.usecase';
import { CrearUsuarioUseCase, CrearUsuarioDto } from '../logic/usuarios/crear-usuario.usecase';
import { ActualizarUsuarioUseCase, ActualizarUsuarioDto } from '../logic/usuarios/actualizar-usuario.usecase';
import { EliminarUsuarioUseCase } from '../logic/usuarios/eliminar-usuario.usecase';

@Controller('usuarios')
@UseGuards(JwtGuard, PermisosGuard)
@RequierePermiso('usuarios:gestionar')
export class UsuariosController {
  constructor(
    private readonly obtener: ObtenerUsuariosUseCase,
    private readonly crear: CrearUsuarioUseCase,
    private readonly actualizar: ActualizarUsuarioUseCase,
    private readonly eliminar: EliminarUsuarioUseCase,
  ) {}

  @Get()
  obtenerTodos() {
    return this.obtener.execute();
  }

  @Post()
  crearUsuario(@Body() dto: CrearUsuarioDto) {
    return this.crear.execute(dto);
  }

  @Put(':id')
  actualizarUsuario(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    return this.actualizar.execute(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(200)
  async eliminarUsuario(@Param('id') id: string) {
    await this.eliminar.execute(Number(id));
    return { mensaje: 'Usuario eliminado correctamente' };
  }
}
