import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
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
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
