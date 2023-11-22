export interface roomType {
  _id: string;
  createdAt: Date;
  roomName: string;
  maxPlayers: number;
  players: { userName: string }[];
}
export type roomPropsType = {
  room: roomType;
};
