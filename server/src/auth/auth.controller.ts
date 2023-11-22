import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { refreshTokenDto } from './dto/refresh-token.dto';
import { registerUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Req() request,
    @Res({ passthrough: true }) response,
    @Ip() ip: string,
    @Body() body: LoginDto,
  ) {
    const { userName, password } = body;
    const userData = await this.authService.login(
      userName,
      password,
      {
        ipAddress: ip,
        userAgent: request.headers['user-agent'],
      },
      response,
    );
    if (!userData) {
      throw new HttpException(
        'Incorrect mail or password',
        HttpStatus.NOT_FOUND,
      );
    }
    return userData;
  }
  @Post('refresh')
  async refreshToken(@Body() body: refreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }
  @Post('register')
  async register(
    @Req() request,
    @Ip() ip: string,
    @Body() body: registerUserDto,
  ) {
    const { userName, password } = body;
    const user = await this.authService.register(
      {
        password,
        userName,
      },
      {
        ipAddress: ip,
        userAgent: request.headers['user-agent'],
      },
    );
    return user;
  }
  @Delete('logout')
  async logout(@Body() body: refreshTokenDto) {
    return this.authService.logout(body.refreshToken);
  }
}
