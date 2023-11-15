import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SeenDataDocument = HydratedDocument<SeenData>;

@Schema()
export class SeenData {
  @Prop()
  user: string;

  @Prop()
  anime: string;

  @Prop()
  episodes: string[];
}

export const SeenDataSchema = SchemaFactory.createForClass(SeenData);
