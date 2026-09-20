import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteDocument = HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
  @Prop({ type: String, required: true, unique: true, index: true, trim: true, lowercase: true })
  address!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 120 })
  title!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 80 })
  author!: string;

  @Prop({ type: String, required: true })
  html!: string;

  @Prop({ type: String, required: true, index: true })
  plainText!: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
