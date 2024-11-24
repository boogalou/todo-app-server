import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserRepository } from '../../../domain/user.repository';
import { UserService } from '../user.service';
import { CreateUserDto } from '../../../web/dto/user/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../../web/mappers/user/user.mapper';
import { UpdateUserDto } from '../../../web/dto/user/update-user.dto';
import { User_Mapper, User_Repository } from '../../../shared/tokens';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(User_Repository)
    private readonly userRepository: UserRepository,
    @Inject(User_Mapper)
    private readonly userMapper: UserMapper,
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    if (await this.getByEmail(dto.email)) {
      throw new ConflictException('User already exists');
    }

    const user = this.userMapper.toCreateUserEntity(dto);
    user.password = await this.hashPassword(dto.password);

    return this.save(user);
  }

  public async delete(id: number): Promise<boolean> {
    return await this.userRepository.softDelete(id);
  }

  public async getByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  public async getById(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }

  public async update(dto: UpdateUserDto): Promise<User> {
    const user = this.userMapper.toUpdateUserEntity(dto);

    return await this.save(user);
  }

  public async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async isOwner(userId: number, resourceId: number): Promise<boolean> {
    const task = await this.findById(resourceId);
    return task && userId === task.user.id;
  }

  private async hashPassword(password: string) {
    return await hash(password, 12);
  }
}
