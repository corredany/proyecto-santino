import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISO_KEY } from '../../presentation/decorators/requiere-permiso.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisoRequerido = this.reflector.getAllAndOverride<string>(PERMISO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permisoRequerido) return true;

    const { user } = context.switchToHttp().getRequest();
    const permisos: string[] = user?.permisos ?? [];

    if (!permisos.includes(permisoRequerido)) {
      throw new ForbiddenException('Sin permisos suficientes');
    }

    return true;
  }
}
