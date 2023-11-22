import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
export type userDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  passwordHash: string;
  @Prop({ type: String, required: true })
  userName: string;
  @Prop({ type: String })
  _id: string;
  @Prop({ type: String || undefined })
  accessToken: string | undefined;
  @Prop({ type: String || undefined })
  refreshToken: string | undefined;
  @Prop({ type: String || undefined })
  unfinishedGame: string | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);
