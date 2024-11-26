import { Inject, Injectable } from '@nestjs/common';
import { UserDetailsService } from '../user-details.service';
import { User_Repository } from '../../../shared/tokens';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserDetails } from '../../../shared/types';

@Injectable()
export class UserDetailsServiceImpl implements UserDetailsService {
  constructor(
    @Inject(User_Repository)
    private readonly userRepository: UserRepository,
  ) {}

  public async findById(id: number): Promise<UserDetails> {
    const user = await this.userRepository.findById(id);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
