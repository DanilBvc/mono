import { IsString, IsNotEmpty } from 'class-validator';

export class reconnectUserDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
