import { UserService } from '../users/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RefreshToken from './entities/refresh.token.entity';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import { sign, verify } from 'jsonwebtoken';
import { Response } from 'express';
@Injectable()
export class AuthService {
  private refreshTokens: RefreshToken[] = [];
  constructor(private readonly userService: UserService) {}

  async refresh(refreshStr: string): Promise<string | undefined> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);
    if (!refreshToken) {
      return undefined;
    }
    const user = this.userService.findById(refreshToken.userId);
    if (!user) {
      return undefined;
    }
    const accessToken = {
      userId: refreshToken.userId,
    };
    return sign(accessToken, process.env.ACCESS_SECRET, { expiresIn: '1h' });
  }

  private retrieveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      const decode = verify(refreshStr, process.env.REFRESH_SECRET);
      if (typeof decode === 'string') {
        return undefined;
      }
      return Promise.resolve(
        this.refreshTokens.find((item) => item.id === decode.id),
      );
    } catch (err) {
      return undefined;
    }
  }

  async login(
    userName: string,
    password: string,
    values: { userAgent: string; ipAddress: string },
    response: Response,
  ) {
    const user = await this.userService.findByName(userName);
    if (!user) return;
    const isValidPassword = await bcrypt.compare(
      password,
      user.toObject().passwordHash,
    );

    if (!isValidPassword) {
      return undefined;
    }
    const tokens = await this.newRefreshAndAccessToken(user, values);
    user.accessToken = tokens.accessToken;
    user.refreshToken = tokens.refreshToken;
    await user.save();
    const userData = { ...user.toObject() };
    delete userData.passwordHash;
    response.cookie('AUTH_TOKEN', userData.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    delete userData.refreshToken;
    return userData;
  }
  private async newRefreshAndAccessToken(
    user: User,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshObject = new RefreshToken({
      id: String(
        this.refreshTokens.length === 0
          ? 0
          : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
      ),
      ...values,
      userId: user._id,
    });
    this.refreshTokens.push(refreshObject);
    return {
      refreshToken: refreshObject.sign(),
      accessToken: sign(
        {
          userId: user._id,
        },
        process.env.ACCESS_SECRET,
        {
          expiresIn: '1h',
        },
      ),
    };
  }
  async register(
    body: {
      userName: string;
      password: string;
    },
    values: { userAgent: string; ipAddress: string },
  ) {
    const { userName } = body;
    const userWithSameMail = await this.userService.findByName(userName);
    if (userWithSameMail) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.userService.createUser(body);
    const userData = { ...user.toObject() };
    delete userData.passwordHash;
    const tokens = await this.newRefreshAndAccessToken(user, values);
    user.refreshToken = tokens.refreshToken;
    user.accessToken = tokens.accessToken;
    await user.save();

    return {
      userData,
      tokens,
    };
  }
  async logout(refreshStr) {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);
    if (!refreshToken) {
      return undefined;
    }
    this.refreshTokens = this.refreshTokens.filter(
      (refreshToken) => refreshToken.id !== refreshToken.id,
    );
  }
}
