import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InviteDataDocument = HydratedDocument<InviteData>;

@Schema()
export class InviteData {
  @Prop()
  parent_user: string;

  @Prop()
  child_user: string;

  @Prop()
  token: string;

  @Prop()
  taken: boolean;
}

export const InviteDataSchema = SchemaFactory.createForClass(InviteData);
