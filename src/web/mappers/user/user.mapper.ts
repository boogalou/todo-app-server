import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDto } from '../../dto/user/user.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';

export interface UserMapper {
  toCreateUserEntity(dto: CreateUserDto): User;

  toUpdateUserEntity(dto: UpdateUserDto): User;

  toDto(entity: User): UserDto;
}
