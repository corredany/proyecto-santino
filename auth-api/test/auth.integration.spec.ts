import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/infrastructure/helpers/exceptions';
import { prisma } from '../src/infrastructure/database/prisma';

describe('Auth Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await prisma.tokenRefresco.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('debe retornar tokens cuando las credenciales son válidas', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', contrasena: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          usuario: expect.objectContaining({
            email: 'admin@test.com',
          }),
        }),
      );
    });

    it('debe retornar 401 cuando las credenciales son incorrectas', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', contrasena: 'incorrecta' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/refresh', () => {
    it('debe retornar nuevo accessToken con refreshToken válido', async () => {
      const loginResponse = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', contrasena: 'password' });

      const refreshToken = loginResponse.body.refreshToken;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await supertest(app.getHttpServer())
        .post('/auth/refresh')
        .send({ token: refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('debe retornar 401 con token inválido', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/refresh')
        .send({ token: 'token_invalido' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/logout', () => {
    it('debe cerrar sesión correctamente', async () => {
      const loginResponse = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', contrasena: 'password' });

      const refreshToken = loginResponse.body.refreshToken;

      const response = await supertest(app.getHttpServer())
        .post('/auth/logout')
        .send({ token: refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          mensaje: 'Sesión cerrada correctamente',
        }),
      );
    });

    it('debe invalidar el refreshToken después del logout', async () => {
      const loginResponse = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', contrasena: 'password' });

      const refreshToken = loginResponse.body.refreshToken;

      await supertest(app.getHttpServer())
        .post('/auth/logout')
        .send({ token: refreshToken });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const refreshResponse = await supertest(app.getHttpServer())
        .post('/auth/refresh')
        .send({ token: refreshToken });

      expect(refreshResponse.status).toBe(401);
    });
  });

  describe('Guard JWT — /usuarios', () => {
    let accessToken: string;

    beforeAll(async () => {
      const loginResponse = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', contrasena: 'password' });
      accessToken = loginResponse.body.accessToken;
    });

    it('debe rechazar con 401 cuando no hay token', async () => {
      const response = await supertest(app.getHttpServer()).get('/usuarios');
      expect(response.status).toBe(401);
    });

    it('debe rechazar con 401 cuando el token es inválido', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/usuarios')
        .set('Authorization', 'Bearer token_completamente_invalido');
      expect(response.status).toBe(401);
    });

    it('debe permitir el acceso con token válido', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/usuarios')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('debe retornar 404 cuando el usuario no existe', async () => {
      const response = await supertest(app.getHttpServer())
        .delete('/usuarios/99999')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
    });

    it('debe retornar 400 cuando los datos de creación son inválidos', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ nombre: 'Test' });
      expect(response.status).toBe(400);
    });
  });
});