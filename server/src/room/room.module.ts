import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { HashPasswordService } from 'src/hashPassword/hashPassword.service';
import { UserService } from 'src/users/user.service';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService, HashPasswordService, UserService, RoomGateway],
})
export class RoomModule {}
