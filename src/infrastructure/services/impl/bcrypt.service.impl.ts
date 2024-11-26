import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { BcryptService } from '../../../application/services/bcryptService';

@Injectable()
export class BcryptServiceImpl implements BcryptService {
  public readonly saltRounds: number = 13;

  public async compare(password: string, hash: string) {
    return await compare(password, hash);
  }

  public async hash(password: string) {
    return await hash(password, this.saltRounds);
  }
}
