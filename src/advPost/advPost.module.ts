import { Module } from '@nestjs/common';
import { AdvPostController } from './advPost.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdvPost, AdvPostSchema } from './advPost.schema';
import { UserService } from 'src/user/user.service';
import { AdvPostService } from './advPost.service';
import { User, UserSchema } from 'src/user/user.schema';
import { SeenData, SeenDataSchema } from 'src/seenData/seenData.schema';
import { InviteData, InviteDataSchema } from 'src/inviteData/inviteData.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdvPost.name, schema: AdvPostSchema },
      { name: SeenData.name, schema: SeenDataSchema },
      { name: InviteData.name, schema: InviteDataSchema },
    ]),
  ],
  controllers: [AdvPostController],
  providers: [UserService, AdvPostService],
})
export class AdvPostModule {}
