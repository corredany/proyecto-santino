import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/infrastructure/helpers/exceptions';
import { jwtConfig } from '../src/infrastructure/config/jwt.config';
import { prisma } from '../src/infrastructure/database/prisma';

describe('Auth Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const rol = await prisma.rol.upsert({
      where: { nombre: 'admin' },
      update: {},
      create: { nombre: 'admin' },
    });

    const permiso = await prisma.permiso.upsert({
      where: { nombre: 'contenido:gestionar' },
      update: {},
      create: { nombre: 'contenido:gestionar' },
    });

    await prisma.rolPermiso.upsert({
      where: { rolId_permisoId: { rolId: rol.id, permisoId: permiso.id } },
      update: {},
      create: { rolId: rol.id, permisoId: permiso.id },
    });

    const contrasena = await bcrypt.hash('password', 10);
    await prisma.usuario.upsert({
      where: { email: 'admin@test.com' },
      update: { contrasena, rolId: rol.id },
      create: { nombre: 'Admin Test', email: 'admin@test.com', contrasena, rolId: rol.id },
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await prisma.tokenRefresco.deleteMany();
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({ where: { email: 'admin@test.com' } });
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

    beforeAll(() => {
      accessToken = jwt.sign(
        {
          id: 1,
          email: 'admin@test.com',
          rolId: 1,
          rolNombre: 'admin',
          permisos: ['usuarios:gestionar'],
        },
        jwtConfig.secret,
        { expiresIn: '15m' },
      );
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