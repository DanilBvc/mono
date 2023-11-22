import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
import { userRole } from 'src/constants/user-role.enum';
export type roomDocument = HydratedDocument<Room>;

@Schema({
  _id: true,
  timestamps: true,
})
export class Room extends Document {
  @Prop({ type: String })
  roomName: string;
  @Prop({ type: String, required: true })
  passwordHash: string;
  @Prop({ type: Number, required: true })
  maxPlayers: number;
  @Prop({
    type: Array,
    validate: [maxPlayersValidation, 'maximum players exceeds'],
  })
  players: { userName: string; _id: string; role: userRole }[];
}

function maxPlayersValidation(value: any[]) {
  const maxPlayers = this.maxPlayers;

  return value.length <= maxPlayers;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2700 });
