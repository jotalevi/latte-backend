import { Module } from '@nestjs/common';
import { AdvPostController } from './advPost.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdvPost, AdvPostSchema } from './advPost.schema';
import { AdvPostService } from './advPost.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdvPost.name, schema: AdvPostSchema }]),
  ],
  controllers: [AdvPostController],
  providers: [AdvPostService, UserService],
})
export class AdvPostModule {}
