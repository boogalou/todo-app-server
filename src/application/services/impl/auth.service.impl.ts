import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../../dto/auth/login-user.dto';
import { AuthService } from '../auth.service';
import {
  Auth_Mapper,
  Password_Service,
  Jwt_Service,
  Logger_Service,
  User_Service,
} from '../../../shared/tokens';
import { UserService } from '../user.service';
import { AuthMapper } from '../../mappers/auth/auth-mapper';
import { AuthResponseDto } from '../../dto/auth/auth-response.dto';
import { JwtService } from '../jwt.service';
import { LoggerService } from '../logger.service';
import { PasswordService } from '../password.service';
import { JwtToken } from '../../../shared/types';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(User_Service)
    private readonly userService: UserService,
    @Inject(Auth_Mapper)
    private readonly authMapper: AuthMapper,
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
    @Inject(Password_Service)
    private readonly bcryptService: PasswordService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordCorrect = await this.bcryptService.compare(dto.password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const accessToken = this.jwtService.createToken(user.id, user.email, JwtToken.ACCESS_TOKEN);
    const refreshToken = this.jwtService.createToken(user.id, user.email, JwtToken.REFRESH_TOKEN);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const jwtPayload = await this.jwtService.validateToken(token, JwtToken.REFRESH_TOKEN);

    const userId = Number(jwtPayload.sub);
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} was not found.`);
    }

    const accessToken = this.jwtService.createToken(user.id, user.email, JwtToken.ACCESS_TOKEN);

    const responseDto = this.authMapper.toDto(user);

    return { ...responseDto, accessToken } as AuthResponseDto;
  }
}
