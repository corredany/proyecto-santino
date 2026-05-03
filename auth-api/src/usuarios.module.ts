import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsuariosController } from './application/controllers/usuarios.controller';
import { RolesController } from './application/controllers/roles.controller';
import { ObtenerUsuariosUseCase } from './application/logic/usuarios/obtener-usuarios.usecase';
import { CrearUsuarioUseCase } from './application/logic/usuarios/crear-usuario.usecase';
import { ActualizarUsuarioUseCase } from './application/logic/usuarios/actualizar-usuario.usecase';
import { EliminarUsuarioUseCase } from './application/logic/usuarios/eliminar-usuario.usecase';
import { PermisosGuard } from './infrastructure/guards/permisos.guard';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [PassportModule],
  controllers: [UsuariosController, RolesController],
  providers: [
    ObtenerUsuariosUseCase,
    CrearUsuarioUseCase,
    ActualizarUsuarioUseCase,
    EliminarUsuarioUseCase,
    PermisosGuard,
    JwtStrategy,
  ],
})
export class UsuariosModule {}
