import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  photo: string;

  @Prop({ default: () => process.env.USER_ROLE })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
