import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { LoginUserDto } from '../../../web/dto/auth/login-user.dto';
import { AuthService } from '../auth.service';
import { Auth_Mapper, Jwt_Service, User_Service } from '../../../shared/tokens';
import { UserService } from '../user.service';
import { AuthMapper } from '../../../web/mappers/auth/auth-mapper';
import { AuthResponseDto } from '../../../web/dto/auth/auth-response.dto';
import { JwtService } from '../../../infrastructure/services/jwt.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(User_Service)
    private readonly userService: UserService,
    @Inject(Auth_Mapper)
    private readonly authMapper: AuthMapper,
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordCorrect = await compare(dto.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const responseDto = this.authMapper.toDto(user);
    const accessToken = this.jwtService.createToken(user.id, user.email, 'accessToken');

    return { ...responseDto, accessToken } as AuthResponseDto;
  }

  async refresh(token: string) {
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const jwtPayload = await this.jwtService.validateToken(token, 'refreshToken');

    const userId = Number(jwtPayload.sub);
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} was not found.`);
    }

    const accessToken = this.jwtService.createToken(user.id, user.email, 'accessToken');

    const responseDto = this.authMapper.toDto(user);

    return { ...responseDto, accessToken } as AuthResponseDto;
  }
}
