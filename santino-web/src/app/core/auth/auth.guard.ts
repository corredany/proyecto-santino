import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  const refreshToken = auth.getRefreshToken();
  if (refreshToken && !auth.isTokenExpired(refreshToken)) {
    return auth.refresh().pipe(
      map(() => true),
      catchError(() => {
        auth.clearTokens();
        return of(router.createUrlTree(['/admin/login']));
      }),
    );
  }

  auth.clearTokens();
  return router.createUrlTree(['/admin/login']);
};
