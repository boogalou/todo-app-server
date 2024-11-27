import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserService } from '../user.service';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../mappers/user/user.mapper';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import { Bcrypt_Service, User_Mapper, User_Repository } from '../../../shared/tokens';
import { BcryptService } from '../bcrypt.service';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(User_Repository)
    private readonly repository: UserRepository,
    @Inject(User_Mapper)
    private readonly userMapper: UserMapper,
    @Inject(Bcrypt_Service)
    private readonly bcryptService: BcryptService,
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    if (await this.repository.isExists(dto.email)) {
      throw new ConflictException('User already exists');
    }

    const user = this.userMapper.toEntityFromCreate(dto);
    user.password = await this.bcryptService.hash(dto.password);

    return this.save(user);
  }

  public async delete(id: number): Promise<boolean> {
    return await this.repository.softDelete(id);
  }

  public async getByEmail(email: string): Promise<User> {
    return this.repository.findByEmail(email);
  }

  public async getById(id: number): Promise<User> {
    return await this.repository.findById(id);
  }

  public async update(dto: UpdateUserDto): Promise<User> {
    const user = this.userMapper.toEntityFromUpdate(dto);

    return await this.save(user);
  }

  public async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  public async isOwner(userId: number, resourceId: number): Promise<boolean> {
    const user = await this.getById(resourceId);
    return user && userId === user.id;
  }
}
