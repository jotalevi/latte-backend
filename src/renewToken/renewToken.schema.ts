import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RenewTokenDocument = HydratedDocument<RenewToken>;

@Schema()
export class RenewToken {
  @Prop()
  user: string;

  @Prop()
  token: string;

  @Prop()
  ip: string;
}

export const RenewTokenSchema = SchemaFactory.createForClass(RenewToken);
