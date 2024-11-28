import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ScrapeCache from './utils/ScrapeCache/ScrapeCache';

async function bootstrap() {
  ScrapeCache.init();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
