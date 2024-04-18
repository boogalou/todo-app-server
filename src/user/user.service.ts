import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/UserEntity';
import { UserDataDto } from '../auth/dto/CreateUser.dto';
import { AuthResponse } from '../types';
import { JwtService } from '../jwt/jwt.service';
import { ProfileDto } from './dto/Profile.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: UserDataDto) {
    const existingUser = await this.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException({
        message: 'A user with this email already exists',
      });
    }

    const newUser = new UserEntity();
    Object.assign(newUser, user);
    return await this.userRepository.save(newUser);
  }

  async update(userId: number, data: ProfileDto, req: Request) {
    const user_Id = this.jwtService.getUserIdFromToken(req);

    if (user_Id !== userId) {
      throw new ForbiddenException('Resource is not accessible. Unauthorized access');
    }

    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = data.username;
    user.email = data.email;

    try {
      const saved = await this.userRepository.save(user);
      return this.modifyUser(saved);
    } catch (err) {
      throw new InternalServerErrorException('Database responded error');
    }
  }

  async delete(userId: number, req: Request) {
    const user_id = this.jwtService.getUserIdFromToken(req);

    if (userId !== user_id) {
      throw new ForbiddenException('Resource is not accessible. Unauthorized access');
    }

    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      return await this.userRepository.remove(user);
    } catch (err) {
      throw new InternalServerErrorException(`Database responded error: ${err}`);
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findById(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  userBuilder(user: UserEntity): Promise<AuthResponse>;
  userBuilder(user: UserEntity, generateRefreshToken: boolean): Promise<AuthResponse>;
  async userBuilder(user: UserEntity, generateRefreshToken: boolean = false) {
    const accessToken = this.jwtService.generateAccessToken(user.id, user.email);
    let refreshToken: string;

    if (generateRefreshToken) {
      refreshToken = this.jwtService.generateRefreshToken(user.id, user.email);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      userPic: user.userPic,
      accessToken,
      refreshToken,
    };
  }

  modifyUser(user: UserEntity) {
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    return user;
  }
}
