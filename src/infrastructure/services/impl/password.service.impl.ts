import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PasswordService } from '../../../application/services/password.service';

@Injectable()
export class PasswordServiceImpl implements PasswordService {
  public readonly saltRounds: number = 13;

  public async compare(password: string, hash: string) {
    return await compare(password, hash);
  }

  public async hash(password: string) {
    return await hash(password, this.saltRounds);
  }
}
