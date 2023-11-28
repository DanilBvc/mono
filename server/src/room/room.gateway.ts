import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomService } from './room.service';
import { socketEvents } from 'src/constants/socket-event.enum';
interface socketType {
  roomId: string;
  players: { socket: Socket; userId: string }[];
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway {
  @WebSocketServer() server: Server;
  constructor(private roomService: RoomService) {}
  private sockets: socketType[] = [];
  findRoom(_id: string) {
    return this.sockets.find((item) => {
      return item.roomId === _id;
    });
  }

  addUser(socket: Socket, roomId: string, userId: string) {
    const room = this.findRoom(roomId);
    if (!room) {
      this.sockets = [
        ...this.sockets,
        { roomId, players: [{ socket, userId }] },
      ];
    } else {
      this.sockets = [
        ...this.sockets,
        { ...room, players: [...room.players, { userId, socket }] },
      ];
      room.players.forEach((player) => {
        player.socket.emit(socketEvents.NEW_PLAYER_JOIN);
      });
    }
  }
  @SubscribeMessage(socketEvents.JOIN_GAME)
  handleConnect(client: Socket, data) {
    this.addUser(client, data._id, data.userId);
  }
  @SubscribeMessage(socketEvents.ADD_STEP)
  async updateStep(socket, data) {
    const { userId, roomId, steps } = data;
    const room = this.findRoom(roomId);
    const users = room.players.filter((item) => item.userId !== userId);
    await this.roomService.addUserStep(userId, roomId, steps);
    users.forEach((user) => {
      user.socket.emit(socketEvents.STEP_UPDATED, steps);
    });
  }
}
