import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configs from './utils/configs';

async function bootstrap() {
  console.log(configs.port);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(configs.port);
}
bootstrap();
