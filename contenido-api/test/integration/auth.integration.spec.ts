import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { prisma } from '../../src/infrastructure/database/prisma';

describe('Auth Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prisma.tokenRefresco.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('debe retornar tokens si las credenciales son correctas', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', contrasena: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.usuario.email).toBe('admin@test.com');
    });

    it('debe retornar 401 si las credenciales son incorrectas', async () => {
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
      expect(response.body.mensaje).toBe('Sesión cerrada correctamente');
    });
  });
});