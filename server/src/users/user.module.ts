import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [AuthService, UserService],
  exports: [UserService],
})
export class UserModule {}
