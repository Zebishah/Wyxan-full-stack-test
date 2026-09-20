import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VisitDocument = HydratedDocument<Visit>;

@Schema({ timestamps: true })
export class Visit {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Person', index: true }) personId!: Types.ObjectId;
  @Prop({ type: String, required: true, trim: true, lowercase: true }) address!: string;
  @Prop({ type: String, required: true, enum: ['typed', 'link', 'back', 'forward', 'search', 'history'] }) source!: string;
  @Prop({ type: Date, required: true, default: Date.now, index: true }) visitedAt!: Date;
  @Prop({ type: String, required: true, trim: true }) title!: string;
  @Prop({ type: Boolean, default: false, index: true }) seeded!: boolean;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
