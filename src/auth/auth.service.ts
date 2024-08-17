import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '../jwt/jwt.service';
import { UserEntity } from '../user/entity/User.entity';
import { LoginDataDto } from './dto/Login.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUser: LoginDataDto): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(loginUser.email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordCorrect = await compare(loginUser.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return user;
  }

  refresh(token: string) {
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const tokenPayload = this.jwtService.validateRefreshToken(token) as JwtPayload;

    if (!tokenPayload) {
      throw new UnauthorizedException('Token is expired');
    }

    const userId = Number(tokenPayload.sub);
    return this.userRepository.findById(userId);
  }
}
