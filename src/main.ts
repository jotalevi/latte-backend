import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configs from './utils/configs';
import ScrapeCache from './utils/ScrapeCache/ScrapeCache';

async function bootstrap() {
  ScrapeCache.init();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
