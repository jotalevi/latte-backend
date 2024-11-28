import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AnimeDataModule } from '../src/animeData/animeData.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('AnimeDataController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb+srv://latte_admin:1kXqUbKBdETa5reg@cluster0.sd7in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        ),
        AnimeDataModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Mock login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/u/login')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(201);

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch the homepage (GET /homepage)', async () => {
    const response = await request(app.getHttpServer())
      .get('/homepage')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body).toHaveProperty('sections');
  });

  it('should fetch popular anime (GET /popular/:page)', async () => {
    const response = await request(app.getHttpServer())
      .get('/popular/1')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body).toHaveProperty('animeList');
    expect(Array.isArray(response.body.animeList)).toBe(true);
  });

  it('should fetch anime details (GET /a/:id)', async () => {
    const animeId = 'test-anime-id';
    const response = await request(app.getHttpServer())
      .get(`/a/${animeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('episodes');
  });

  it('should fetch anime episode details (GET /a/:id/:ep)', async () => {
    const animeId = 'test-anime-id';
    const episode = '1';
    const response = await request(app.getHttpServer())
      .get(`/a/${animeId}/${episode}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body).toHaveProperty('episodeDetails');
  });

  it('should search for anime (GET /search)', async () => {
    const searchStr = 'naruto';
    const response = await request(app.getHttpServer())
      .get('/search')
      .query({ search_str: searchStr })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
  });
});
