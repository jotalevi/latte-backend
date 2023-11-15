import { Module } from '@nestjs/common';
import { AnimeDataController } from './animeData.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/user.schema';
import { SeenData, SeenDataSchema } from 'src/seenData/seenData.schema';
import { InviteData, InviteDataSchema } from 'src/inviteData/inviteData.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SeenData.name, schema: SeenDataSchema },
      { name: InviteData.name, schema: InviteDataSchema },
    ]),
  ],
  controllers: [AnimeDataController],
  providers: [UserService],
})
export class AnimeDataModule {}
