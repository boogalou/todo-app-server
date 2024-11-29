import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
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

  public async create(dto: CreateUserDto) {
    if (await this.repository.isExists(dto.email)) {
      throw new ConflictException('User already exists');
    }

    const user = this.userMapper.toEntityFromCreate(dto);
    user.password = await this.bcryptService.hash(dto.password);

    return this.save(user);
  }

  public async delete(id: number) {
    return await this.repository.softDelete(id);
  }

  public async getByEmail(email: string) {
    const userEntity = await this.repository.findByEmail(email);

    if (!userEntity) {
      throw new BadRequestException('User not found');
    }

    return userEntity;
  }

  public async getById(id: number) {
    const userEntity = await this.repository.findById(id);

    if (!userEntity) {
      throw new BadRequestException('User not found');
    }

    return userEntity;
  }

  public async isExists(email: string) {
    return await this.repository.isExists(email);
  }

  public async update(dto: UpdateUserDto) {
    const user = this.userMapper.toEntityFromUpdate(dto);

    return await this.save(user);
  }

  public async save(user: User) {
    return await this.repository.save(user);
  }

  public async isOwner(userId: number, resourceId: number) {
    const user = await this.getById(resourceId);
    return user && userId === user.id;
  }
}
