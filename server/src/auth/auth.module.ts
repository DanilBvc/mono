import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/users/user.module';

@Module({
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  imports: [UserModule],
})
export class AuthModule {}
