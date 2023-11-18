import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoles } from 'src/enum/userRoles.enum';
import { SeenData } from 'src/seenData/seenData.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  username: string;

  @Prop()
  mail: string;

  @Prop()
  favs: string[];

  @Prop()
  seen: SeenData[];

  @Prop()
  hash: string;

  @Prop()
  salt: string;

  @Prop()
  token: string;

  @Prop()
  role: UserRoles;

  @Prop()
  invites_left: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
