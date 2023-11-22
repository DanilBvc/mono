import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async whoAmI(@Req() request) {
    const userId = request.user.userId;
    return this.userService.findById(userId);
  }
}
