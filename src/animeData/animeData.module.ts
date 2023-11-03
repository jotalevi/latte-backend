import { Module } from '@nestjs/common';
import { AnimeDataController } from './animeData.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
  controllers: [AnimeDataController],
})
export class AnimeDataModule {}
