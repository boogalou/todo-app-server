import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserDto } from '../../dto/user/user.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';

@Injectable()
export class UserMapperImpl implements UserMapper {
  toCreateUserEntity(dto: CreateUserDto): User {
    return plainToInstance(User, dto);
  }

  toUpdateUserEntity(dto: UpdateUserDto): User {
    return plainToInstance(User, dto);
  }

  toDto(entity: User): UserDto {
    return plainToInstance(UserDto, instanceToPlain(entity));
  }
}
