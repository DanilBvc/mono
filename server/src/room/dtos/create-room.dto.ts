import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class createRoomDto {
  @IsString()
  @IsNotEmpty()
  roomName: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsNumber()
  maxPlayers: number;
}
