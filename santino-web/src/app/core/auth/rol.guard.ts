import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export function rolGuard(rolesPermitidos: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const usuario = auth.getUsuario();

    if (usuario?.rolNombre && rolesPermitidos.includes(usuario.rolNombre)) {
      return true;
    }

    return router.createUrlTree(['/admin/dashboard']);
  };
}
