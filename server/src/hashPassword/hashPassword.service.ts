import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class HashPasswordService {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
  async comparePassword(inputPassword: string, password: string) {
    return await bcrypt.compare(inputPassword, password);
  }
}
