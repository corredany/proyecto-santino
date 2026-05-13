import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const usuarioId = (req as any).user?.id ?? 'anonimo';
    const inicio = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const status = context.switchToHttp().getResponse().statusCode;
          const ms = Date.now() - inicio;
          this.logger.log(`${method} ${url} — usuario=${usuarioId} — ${status} (${ms}ms)`);
        },
        error: (error) => {
          const status = error?.status ?? 500;
          const ms = Date.now() - inicio;
          this.logger.warn(`${method} ${url} — usuario=${usuarioId} — ${status} (${ms}ms)`);
        },
      }),
    );
  }
}
