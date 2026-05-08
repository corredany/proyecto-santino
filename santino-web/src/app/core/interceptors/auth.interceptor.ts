import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const RETRIED = new HttpContextToken(() => false);

const addToken = (req: Parameters<HttpInterceptorFn>[0], token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

const isAuthEndpoint = (url: string) =>
  url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (isAuthEndpoint(req.url)) return next(req);

  const token = authService.getToken();
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if ((err.status === 502 || err.status === 503) && !req.context.get(RETRIED)) {
        const retryReq = req.clone({ context: req.context.set(RETRIED, true) });
        return timer(1000).pipe(
          switchMap(() => next(token ? addToken(retryReq, token) : retryReq)),
        );
      }
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
