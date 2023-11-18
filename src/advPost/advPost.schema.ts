import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdvPostDocument = HydratedDocument<AdvPost>;

@Schema()
export class AdvPost {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  is_title_image: boolean;

  @Prop()
  short: string;

  @Prop()
  description: string;

  @Prop()
  link_to: string;

  @Prop()
  media_url: string;

  @Prop()
  active: boolean;
}

export const AdvPostSchema = SchemaFactory.createForClass(AdvPost);
