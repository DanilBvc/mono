import { userRole } from 'src/constants/user-role.enum';

export interface roomType {
  _id: string;
  createdAt: Date;
  roomName: string;
  maxPlayers: number;
  whosTurn: string;
  players: {
    userName: string;
    _id: string;
    role: userRole;
    money: number;
    property: string[];
    steps: number;
  }[];
}
export type roomPropsType = {
  room: roomType;
};
