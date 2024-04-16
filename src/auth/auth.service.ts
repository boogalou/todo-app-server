import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';
import { UserEntity } from '../user/entity/UserEntity';
import { ILoginUserDto } from './dto/AuthUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUser: ILoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findUserByEmail(loginUser.email);

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
    return this.userService.findUserById(userId);
  }
}
