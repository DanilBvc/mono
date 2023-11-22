import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SessionGateway {
  @WebSocketServer() server: Server;
  @SubscribeMessage('message')
  handleDisconnect(client: Socket) {
    console.log(`disconnect ${client.id}`);
  }
  handleConnect(client: Socket) {
    console.log(`connect ${client.id}`);
  }
}
