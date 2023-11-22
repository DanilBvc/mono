import { IsNotEmpty, IsString } from 'class-validator';

export class registerUserDto {
  @IsNotEmpty()
  @IsString()
  userName: string;
  @IsNotEmpty()
  password: string;
}
