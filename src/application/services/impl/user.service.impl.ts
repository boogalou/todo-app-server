import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserService } from '../user.service';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../mappers/user/user.mapper';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import {
  File_Storage_Service,
  Logger_Service,
  Password_Service,
  User_Mapper,
  User_Repository,
} from '../../../shared/tokens';
import { PasswordService } from '../password.service';
import { LoggerService } from '../logger.service';
import { FileStorageService } from '../file-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(User_Repository)
    private readonly repository: UserRepository,
    @Inject(User_Mapper)
    private readonly userMapper: UserMapper,
    @Inject(Password_Service)
    private readonly passwordService: PasswordService,
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
    @Inject(File_Storage_Service)
    private readonly fileStorageService: FileStorageService,
  ) {}

  public async create(dto: CreateUserDto) {
    this.logger.info(`Attempt to create user with Email: ${dto.email}`);

    if (await this.repository.isExists(dto.email)) {
      this.logger.warn(`User creation failed. Email ${dto.email} already exists.`);
      throw new ConflictException('User already exists');
    }

    const user = this.userMapper.toEntityFromCreate(dto);
    user.password = await this.passwordService.hash(dto.password);

    this.logger.info(`User with Email ${dto.email} created successfully with ID: ${user.id}`);
    return this.save(user);
  }

  public async delete(id: number) {
    return null;
  }

  public async getByEmail(email: string) {
    const userEntity = await this.repository.findByEmail(email);

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    return userEntity;
  }

  public async getById(id: number) {
    const userEntity = await this.repository.findById(id);

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }
    console.log(this.userMapper.toDto(userEntity));
    return userEntity;
  }

  public async isExists(email: string) {
    return await this.repository.isExists(email);
  }

  public async update(dto: UpdateUserDto, userId: number) {
    const userEntity = await this.getById(userId);

    const mergedUser = this.userMapper.mergeUpdate(dto, userEntity);

    const updateUser = await this.save(mergedUser);
    return this.userMapper.toDto(updateUser);
  }

  public async save(user: User) {
    return this.repository.save(user);
  }

  public async updateAvatar(id: number, file: Express.Multer.File) {
    const userEntity = await this.getById(id);

    if (userEntity.userPic) {
      await this.fileStorageService.deleteFile('avatars', userEntity.userPic);
    }

    const uniqueFileName = `${id}-${Date.now()}-${file.originalname}`;

    await this.fileStorageService.uploadFile('avatars', uniqueFileName, file.buffer);

    const fileUrl = `${this.configService.get('MINIO_URL')}:${this.configService.get('MINIO_PORT')}/avatars/${uniqueFileName}`;

    userEntity.userPic = fileUrl;
    const updatedUser = await this.save(userEntity);

    return this.userMapper.toDto(updatedUser);
  }

  public async isOwner(userId: number, resourceId: number) {
    const user = await this.getById(resourceId);
    return user && userId === user.id;
  }
}
