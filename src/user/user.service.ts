import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entity/User.entity';
import { RegistrationDto } from '../auth/dto/Registration.dto';
import { ExtRequest } from '../shared/types';
import { JwtService } from '../jwt/jwt.service';
import { ProfileDto } from './dto/Profile.dto';
import { UserRepository } from './user.repository';
import { UserSettingsService } from '../user-settings/user-settings.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  async create(registrationDto: RegistrationDto) {
    const existingUser = await this.userRepository.findByEmail(registrationDto.email);

    if (existingUser) {
      throw new ConflictException({
        message: 'A user with this email already exists',
      });
    }

    const newUser = this.userRepository.createEntity(registrationDto);
    const savedUser = await this.userRepository.save(newUser);
    await this.userSettingsService.initializeDefaultSettings(savedUser);

    return savedUser;
  }

  async update(data: ProfileDto, req: ExtRequest) {
    const userId = req.user.id;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = data.username;
    user.email = data.email;

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException('Database responded error');
    }
  }

  async delete(userId: number, req: ExtRequest) {
    const user_id = req.user.id;

    if (userId !== user_id) {
      throw new ForbiddenException('Resource is not accessible. Unauthorized access');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      return await this.userRepository.remove(user);
    } catch (err) {
      throw new InternalServerErrorException(`Database responded error: ${err}`);
    }
  }

  userBuilder(user: UserEntity) {
    const accessToken = this.jwtService.generateToken(user.id, user.email, 'accessToken');
    const refreshToken = this.jwtService.generateToken(user.id, user.email, 'refreshToken');

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      userPic: user.userPic,
      accessToken,
      refreshToken,
    };
  }
}
