import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createRoomDto } from './dtos/create-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema';
import { Model } from 'mongoose';
import { HashPasswordService } from 'src/hashPassword/hashPassword.service';
import { UserService } from 'src/users/user.service';
import { userRole } from 'src/constants/user-role.enum';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    private readonly hashPasswordService: HashPasswordService,
    private readonly userService: UserService,
  ) {}

  async reconnectUser(userId: string, roomId: string) {
    const user = await this.userService.findById(userId);
    const room = await this.getRoom(roomId);
    const isUserMemberOfGame = room?.players.find(
      (player) => player._id === userId,
    );
    const isThisGameUnfinished = user.unfinishedGame === String(room._id);
    if (isUserMemberOfGame && isThisGameUnfinished) {
      return room;
    } else {
      throw new HttpException('Failed to reconnect', HttpStatus.BAD_REQUEST);
    }
  }

  private async removeRoom(roomId: string) {
    try {
      await this.roomModel.findByIdAndDelete({ _id: roomId });
    } catch (err) {
      throw new HttpException(
        'Failed to remove room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async kickPlayerFromRoom(userId: string, room: Room) {
    try {
      room.players = [
        ...room.players.filter((player) => player._id !== userId),
      ];
      await room.save();
    } catch (err) {
      throw new HttpException(
        'Something went wrong...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async handleUnfinishedGames(
    userId: string,
    room: Room,
  ): Promise<void> {
    const unfinishedGameId =
      await this.userService.getUnfinishedUserGame(userId);
    const unfinishedRoom = await this.getRoom(unfinishedGameId);
    const unfinishedGame = room.players.find((player) => player._id === userId);
    if (unfinishedGame) {
      if (unfinishedGame.role === userRole.HOST) {
        await this.removeRoom(unfinishedGameId);
      } else if (unfinishedGame.role === userRole.PLAYER) {
        await this.kickPlayerFromRoom(userId, unfinishedRoom);
      }
    }
  }

  private async verifyRoomExists(id: string): Promise<Room> {
    const room = await this.getRoom(id);
    if (!room) {
      throw new HttpException('Room isn`t exist', HttpStatus.NOT_FOUND);
    }
    return room;
  }

  private async verifyRoomPassword(
    password: string,
    room: Room,
  ): Promise<void> {
    const isPasswordValid = await this.hashPasswordService.comparePassword(
      password,
      room.passwordHash,
    );
    if (!isPasswordValid) {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }
  }

  private async checkRoomCapacity(room: Room): Promise<void> {
    const { players, maxPlayers } = room;
    if (players.length >= maxPlayers) {
      throw new HttpException('Maximum players', HttpStatus.FORBIDDEN);
    }
  }

  async getRooms(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const objects = await this.roomModel
        .find()
        .skip(skip)
        .limit(limit)
        .exec();

      return objects;
    } catch (err) {
      throw new HttpException('Failed to fetch rooms', HttpStatus.BAD_REQUEST);
    }
  }

  async getRoom(id: string) {
    try {
      const room = await this.roomModel.findOne({ _id: id });
      return room;
    } catch (err) {
      throw new HttpException(
        'Failed to fetch room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async joinRoom(id: string, password: string, userId: string) {
    try {
      const room = await this.verifyRoomExists(id);
      await this.verifyRoomPassword(password, room);
      const { players } = room;
      await this.checkRoomCapacity(room);
      const { userName, _id } = await this.userService.findById(userId);
      let role = userRole.PLAYER;
      if (!room.players.find((player) => player._id === userId)) {
        role = userRole.HOST;
      }
      await this.handleUnfinishedGames(userId, room);

      players.push({ userName, _id, role, steps: 0, property: [], money: 0 });
      await this.userService.addUnfinishedUserGame(_id, room._id);
      await room.save();

      return room;
    } catch (err) {
      throw new HttpException('Failed to join room', HttpStatus.CONFLICT);
    }
  }

  async createRoom(@Body() body: createRoomDto, userId: string) {
    try {
      const { roomName, password, maxPlayers } = body;
      const roomExist = await this.roomModel.exists({ roomName });
      const user = await this.userService.findById(userId);
      const { userName, _id } = user;
      if (!roomExist) {
        const passwordHash =
          await this.hashPasswordService.hashPassword(password);
        const room = new this.roomModel({
          passwordHash,
          roomName,
          maxPlayers,
          whosTurn: userId,
          players: [
            {
              userName,
              _id,
              role: userRole.HOST,
              steps: 0,
              money: 0,
              property: [],
            },
          ],
        });
        await this.userService.addUnfinishedUserGame(userId, room._id);
        await room.save();
        return room;
      } else {
        throw new HttpException(
          'Room with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
    } catch (err) {
      throw new HttpException(
        'Failed to create room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async addUserStep(userId: string, roomId: string, steps: number) {
    const update = {
      $inc: { 'players.$[elem].steps': steps },
    };
    const options = {
      new: true,
      arrayFilters: [{ 'elem._id': userId }],
    };

    const updatedRoom = await this.roomModel.findOneAndUpdate(
      { _id: roomId },
      update,
      options,
    );

    if (!updatedRoom) {
      throw new Error('Room not found');
    }

    return updatedRoom;
  }
}
