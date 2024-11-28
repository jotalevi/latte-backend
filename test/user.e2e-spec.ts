import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let renewToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb+srv://latte_admin:1kXqUbKBdETa5reg@cluster0.sd7in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        ),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register user (POST /u/register)', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpass',
      mail: 'testuser@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/u/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('username', userData.username);
    expect(response.body).toHaveProperty('mail', userData.mail);
  });

  it('should login user (POST /u/login)', async () => {
    const response = await request(app.getHttpServer())
      .post('/u/login')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('renew');
    authToken = response.body.token;
    renewToken = response.body.renew; // Save token for subsequent requests
  });

  it('should fetch user data (GET /u)', async () => {
    const response = await request(app.getHttpServer())
      .get('/u')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('mail');
  });

  it('should fetch user invites (GET /u/invite)', async () => {
    const response = await request(app.getHttpServer())
      .get('/u/invite')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('invite_token');
  });

  it('should fetch favorites (GET /u/favs)', async () => {
    const response = await request(app.getHttpServer())
      .get('/u/favs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('favs');
    expect(Array.isArray(response.body.favs)).toBe(true);
  });

  it('should update favorites (POST /u/favs)', async () => {
    const animeId = 'anime123';
    const response = await request(app.getHttpServer())
      .post('/u/favs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ id: animeId })
      .expect(201);

    expect(response.body).toHaveProperty('favs');
    expect(Array.isArray(response.body.favs)).toBe(true);
  });

  it('should fetch seen data (GET /u/seen)', async () => {
    const response = await request(app.getHttpServer())
      .get('/u/seen')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('seen');
    expect(Array.isArray(response.body.seen)).toBe(true);
  });

  it('should update seen data (POST /u/seen)', async () => {
    const seenData = { anime: 'anime123', episodes: ['ep1', 'ep2'] };
    const response = await request(app.getHttpServer())
      .post('/u/seen')
      .set('Authorization', `Bearer ${authToken}`)
      .send(seenData)
      .expect(201);

    expect(response.body).toHaveProperty('seen');
    expect(Array.isArray(response.body.seen)).toBe(true);
  });

  it('should renew user token (POST /u/renew)', async () => {
    const renewData = { token: renewToken };
    const response = await request(app.getHttpServer())
      .post('/u/renew')
      .send(renewData)
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('renew');
  });

  it('should delete user (DELETE /u/)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/u')
      .set('Authorization', `Bearer ${authToken}`)
      .send()
      .expect(200);
  });
});
