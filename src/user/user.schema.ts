import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SeenAnimeEp, SeenAnimeEps } from './dto/UserData.dto';

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
  hash: string;

  @Prop()
  salt: string;

  @Prop()
  token: string;

  @Prop()
  invites_left: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
