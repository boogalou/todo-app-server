import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepositoryImpl extends BaseRepository<User> implements UserRepository {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  public async findById(userId: number): Promise<User | null> {
    return this.handler(
      () => this.repository.findOne({ where: { id: userId } }),
      'Error occurred while retrieving user',
      userId,
    );
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.handler(
      () => this.repository.findOne({ where: { email } }),
      'Error occurred while retrieving user with email',
    );
  }

  public async save(user: User): Promise<User> {
    return this.handler(
      () => this.repository.save(user),
      'Error occurred while saving user',
      user.id,
    );
  }

  public async delete(user: User): Promise<User> {
    return this.handler(
      () => this.repository.remove(user),
      'Error occurred while attempting to soft delete user',
      user.id,
    );
  }

  public async isExists(email: string): Promise<boolean> {
    return this.handler(
      () => this.repository.exists({ where: { email } }),
      'Error occurred while checking existence of user with email',
    );
  }
}
