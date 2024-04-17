import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/UserEntity';
import { UserDataDto } from '../auth/dto/CreateUser.dto';
import { AuthResponse } from '../types';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileDto } from './dto/EditProfile.dto';

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

  async update(userId: number, data: EditProfileDto) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = data.username;
    user.email = data.email;

    return this.userRepository.save(user);
  }

  async delete(userId: number) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.remove(user);
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
      accessToken,
      refreshToken,
    };
  }
}
