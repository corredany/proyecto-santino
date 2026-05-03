import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermisosGuard } from './guards/permisos.guard';

@Global()
@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, PermisosGuard],
  exports: [PassportModule, JwtStrategy, PermisosGuard],
})
export class InfrastructureModule {}
