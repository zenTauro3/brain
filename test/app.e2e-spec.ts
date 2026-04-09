import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';

import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

describe('Flujo Completo de la API (e2e)', () => {
  let app: INestApplication;

  let accessToken: string;
  let refreshToken: string;

  const uniqueId = Date.now();
  const testUser = {
    email: `jaume+${uniqueId}@test.com`,
    password: 'PasswordSuperSegura123',
    username: `jaume_${uniqueId}`,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 🛡️ Activamos los escudos
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // ✨ ACTIVAMOS EL INTERCEPTOR EN EL TEST
    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. [Auth] Rechaza un Login vacío (400)', () => {
    return request(app.getHttpServer()).post('/auth/login').send({}).expect(400);
  });

  it('2. [Users] Bloquea /users/me sin token (401)', () => {
    return request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('3. [Auth] Registra un usuario nuevo (201)', async () => {
    const response = await request(app.getHttpServer()).post('/auth/register').send(testUser).expect(201);

    if (response.body.data) {
      expect(response.body.data).not.toHaveProperty('password');
    }
  });

  it('4. [Auth] Inicia sesión y obtiene los tokens (200)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    accessToken = response.body.data.access_token;
    refreshToken = response.body.data.refresh_token;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('5. [Users] Recupera su perfil con el Access Token (200)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.data.username).toBe(testUser.username);
  });

  it('6. [Auth] Refresca la sesión con el Refresh Token (200)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refresh_token: refreshToken })
      .expect(200);

    accessToken = response.body.data.access_token;
    expect(accessToken).toBeDefined();
  });

  it('7. [Brain] Envía un mensaje a la IA a través del chat (200)', async () => {
    jest.setTimeout(15000);

    const response = await request(app.getHttpServer())
      .post('/chat')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ message: 'Hola, esto es un test E2E automatizado.' })
      .expect(200);

    expect(typeof response.body.data).toBe('string');
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
