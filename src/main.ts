import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configs from './utils/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(configs.port);
}
bootstrap();
