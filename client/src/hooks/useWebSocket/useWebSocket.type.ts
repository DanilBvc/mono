import {Socket} from "socket.io-client";

export type WebSocketHookReturnType = {
  socket: Socket | null;
  isConnected: boolean;
};
