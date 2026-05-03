import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import {
  CredencialesInvalidasException,
  TokenInvalidoException,
  TokenRevocadoException,
  UsuarioNoEncontradoException,
} from '../../domain/exceptions/auth.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof CredencialesInvalidasException) {
      return response.status(401).json({ error: exception.message });
    }

    if (exception instanceof TokenInvalidoException || exception instanceof TokenRevocadoException) {
      return response.status(401).json({ error: exception.message });
    }

    if (exception instanceof UsuarioNoEncontradoException) {
      return response.status(404).json({ error: exception.message });
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({ error: exception.message });
    }

    return response.status(500).json({ error: 'Error interno del servidor' });
  }
}