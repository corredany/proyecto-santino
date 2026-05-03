import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/helpers/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((_req: unknown, res: { setHeader: (k: string, v: string) => void }, next: () => void) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
