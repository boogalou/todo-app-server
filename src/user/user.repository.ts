import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/User.entity';
import { Repository } from 'typeorm';
import { RegistrationDto } from '../auth/dto/Registration.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(userId: number) {
    try {
      return await this.repository.findOne({ where: { id: userId } });
    } catch (err) {
      throw new InternalServerErrorException(`Failed to find user by ID. Database error: ${err}`);
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.repository.findOne({ where: { email: email } });
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to find user by Email. Database error: ${err}`,
      );
    }
  }

  async save(user: UserEntity) {
    try {
      return await this.repository.save(user);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to save user. Database error: ${err}`);
    }
  }

  async remove(user: UserEntity) {
    try {
      return await this.repository.remove(user);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to save user. Database error: ${err}`);
    }
  }

  createEntity(registrationDto: RegistrationDto) {
    return this.repository.create(registrationDto);
  }
}
