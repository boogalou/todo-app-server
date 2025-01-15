import { CreateUserDto } from '../dto/user/create-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserDto } from '../dto/user/user.dto';

export interface UserService {
  create(dto: CreateUserDto): Promise<User>;

  save(entity: User): Promise<User>;

  getById(id: number): Promise<User>;

  getByEmail(id: string): Promise<User>;

  isExists(email: string): Promise<boolean>;

  update(dto: UpdateUserDto, id: number): Promise<UserDto>;

  delete(id: number): Promise<boolean>;

  updateAvatar(id: number, file: Express.Multer.File): Promise<UserDto>;
}
