import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { createRoomDto } from './dtos/create-room.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { joinRoomDto } from './dtos/join-room.dto';
import { reconnectUserDto } from './dtos/reconnect-user.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Get('rooms')
  @UseGuards(JwtAuthGuard)
  async getRooms(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.roomService.getRooms(page, limit);
  }
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createRoom(@Req() req, @Body() body: createRoomDto) {
    const userId = req.user.userId;
    return await this.roomService.createRoom(body, userId);
  }
  @Post('join')
  @UseGuards(JwtAuthGuard)
  async joinRoom(@Req() req, @Body() body: joinRoomDto) {
    const userId = req.user.userId;
    const { password, id } = body;
    return await this.roomService.joinRoom(id, password, userId);
  }
  @Post('reconnect')
  @UseGuards(JwtAuthGuard)
  async reconnectToRoom(@Req() req, @Body() body: reconnectUserDto) {
    const userId = req.user.userId;
    const { roomId } = body;
    return await this.roomService.reconnectUser(userId, roomId);
  }
}
