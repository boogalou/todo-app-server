import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserDto } from '../../dto/user/user.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';

@Injectable()
export class UserMapperImpl implements UserMapper {
  toEntityFromCreate(dto: CreateUserDto): User {
    return plainToInstance(User, dto);
  }

  mergeUpdate(dto: UpdateUserDto, existingEntity: User): User {
    const updatedEntity = { ...instanceToPlain(existingEntity), ...dto };
    return plainToInstance(User, updatedEntity);
  }

  toDto(entity: User): UserDto {
    return plainToInstance(UserDto, instanceToPlain(entity), { excludeExtraneousValues: true });
  }
}
