import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from '../../src/app.module';
import { DomainExceptionFilter } from '../../src/presentation/filters/domain-exception.filter';
import { jwtConfig } from '../../src/infrastructure/config/jwt.config';
import { prisma } from '../../src/infrastructure/database/prisma';

describe('Contenido Integration', () => {
  let app: INestApplication;
  let tokenAdmin: string;

  beforeAll(async () => {
    await prisma.seccion.deleteMany({ where: { nombre: 'Seccion Test Integracion' } });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    tokenAdmin = jwt.sign(
      {
        id: 1,
        email: 'admin@test.com',
        rolId: 1,
        rolNombre: 'admin',
        permisos: ['contenido:gestionar'],
      },
      jwtConfig.secret,
      { expiresIn: '15m' },
    );
  });

  afterAll(async () => {
    await prisma.seccion.deleteMany({ where: { nombre: 'Seccion Test Integracion' } });
    await app.close();
  });

  // ─── Endpoints públicos ───────────────────────────────────────────────────

  describe('GET /secciones — público', () => {
    it('debe retornar 200 sin necesidad de token', async () => {
      const response = await supertest(app.getHttpServer()).get('/secciones');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /secciones/visibles — público', () => {
    it('debe retornar 200 sin necesidad de token', async () => {
      const response = await supertest(app.getHttpServer()).get('/secciones/visibles');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /imagenes — público', () => {
    it('debe retornar 200 sin necesidad de token', async () => {
      const response = await supertest(app.getHttpServer()).get('/imagenes');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /videos — público', () => {
    it('debe retornar 200 sin necesidad de token', async () => {
      const response = await supertest(app.getHttpServer()).get('/videos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ─── 404 cuando recurso no existe ────────────────────────────────────────

  describe('GET /secciones/:id — recurso inexistente', () => {
    it('debe retornar 404 cuando la sección no existe', async () => {
      const response = await supertest(app.getHttpServer()).get('/secciones/99999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /imagenes/:id — recurso inexistente', () => {
    it('debe retornar 404 cuando la imagen no existe', async () => {
      const response = await supertest(app.getHttpServer()).get('/imagenes/99999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /videos/:id — recurso inexistente', () => {
    it('debe retornar 404 cuando el video no existe', async () => {
      const response = await supertest(app.getHttpServer()).get('/videos/99999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  // ─── Guard JWT — endpoints protegidos ────────────────────────────────────

  describe('POST /secciones — guard JWT', () => {
    it('debe rechazar con 401 cuando no hay token', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/secciones')
        .send({ nombre: 'Test', orden: 1 });
      expect(response.status).toBe(401);
    });

    it('debe rechazar con 401 cuando el token es inválido', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/secciones')
        .set('Authorization', 'Bearer token_invalido')
        .send({ nombre: 'Test', orden: 1 });
      expect(response.status).toBe(401);
    });

    it('debe aceptar la petición con token válido', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/secciones')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ nombre: 'Seccion Test Integracion', orden: 99 });

      expect([201, 200]).toContain(response.status);
    });
  });

  describe('POST /imagenes — guard JWT', () => {
    it('debe rechazar con 401 cuando no hay token', async () => {
      const response = await supertest(app.getHttpServer()).post('/imagenes');
      expect(response.status).toBe(401);
    });

    it('debe rechazar con 401 cuando el token es inválido', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/imagenes')
        .set('Authorization', 'Bearer token_invalido');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /videos — guard JWT', () => {
    it('debe rechazar con 401 cuando no hay token', async () => {
      const response = await supertest(app.getHttpServer()).post('/videos');
      expect(response.status).toBe(401);
    });

    it('debe rechazar con 401 cuando el token es inválido', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/videos')
        .set('Authorization', 'Bearer token_invalido');
      expect(response.status).toBe(401);
    });
  });
});
