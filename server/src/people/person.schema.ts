import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PersonDocument = HydratedDocument<Person>;

@Schema({ timestamps: true })
export class Person {
  @Prop({ type: String, required: true, unique: true, trim: true }) name!: string;
  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true }) slug!: string;
  @Prop({ type: String, required: true, maxlength: 160 }) bio!: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
