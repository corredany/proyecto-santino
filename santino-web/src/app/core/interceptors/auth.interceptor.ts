import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const addToken = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

const isAuthEndpoint = (url: string) =>
  url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // No adjuntar token ni interceptar errores en las rutas de autenticación
  if (isAuthEndpoint(req.url)) return next(req);

  const token = authService.getToken();
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 && authService.getRefreshToken()) {
        return authService.refresh().pipe(
          catchError(() => {
            authService.clearTokens();
            return throwError(() => err);
          }),
          switchMap((res) => next(addToken(req, res.accessToken))),
        );
      }
      return throwError(() => err);
    }),
  );
};
