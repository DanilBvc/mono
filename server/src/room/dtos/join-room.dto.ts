import { IsString, IsNotEmpty } from 'class-validator';

export class joinRoomDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
