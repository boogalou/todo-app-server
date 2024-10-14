import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '../jwt/jwt.service';
import { UserEntity } from '../user/entity/User.entity';
import { LoginDto } from './dto/Login.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordCorrect = await compare(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return user;
  }

  async refresh(token: string) {
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const tokenPayload = (await this.jwtService.validateToken(token, 'refreshToken')) as JwtPayload;

    if (!tokenPayload) {
      throw new UnauthorizedException('Token is expired');
    }

    const userId = Number(tokenPayload.sub);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} was not found.`);
    }

    return user;
  }
}
