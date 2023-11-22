import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  userName: string;
  @IsNotEmpty()
  password: string;
}
