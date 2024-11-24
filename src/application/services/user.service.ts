import { CreateUserDto } from '../../web/dto/user/create-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../web/dto/user/update-user.dto';

export interface UserService {
  create(dto: CreateUserDto): Promise<User>;

  save(entity: User): Promise<User>;

  getById(id: number): Promise<User>;

  getByEmail(id: string): Promise<User>;

  update(dto: UpdateUserDto): Promise<User>;

  delete(id: number): Promise<boolean>;
}
