import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { createUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async findUser(@Param('id') id: string) {
    try {
      const user = await this.userModel
        .findOne({ _id: id })
        .select('-passwordHash');
      return user;
    } catch (err) {
      throw new HttpException(
        'something went wrong...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(@Body() body: createUserDto) {
    try {
      const { userName, password } = body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = new this.userModel({
        userName,
        passwordHash: hash,
        _id: new mongoose.Types.ObjectId(),
        refreshToken: undefined,
        accessToken: undefined,
      });

      return user;
    } catch (Err) {
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByName(userName: string) {
    try {
      const user = await this.userModel.findOne({ userName });
      return user;
    } catch (err) {
      throw new HttpException(
        'Failed to find user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findModelById(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id });
      return user;
    } catch (err) {
      throw new HttpException('Failed to find user', HttpStatus.NOT_FOUND);
    }
  }
  async findById(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (user) {
        const userData = { ...user.toObject() };
        delete userData.passwordHash;
        return userData;
      }
      return undefined;
    } catch (err) {
      throw new HttpException('Failed to find user', HttpStatus.NOT_FOUND);
    }
  }
  async addUnfinishedUserGame(userId: string, gameId: string) {
    const user = await this.findModelById(userId);
    user.unfinishedGame = gameId;
    await user.save();
  }
  async getUnfinishedUserGame(userId: string) {
    const user = await this.findModelById(userId);
    return user.unfinishedGame;
  }
}
