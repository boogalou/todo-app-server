import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Cookies } from '../security/decorators/cookies.decorator';
import { LoginUserDto } from '../dto/auth/login-user.dto';
import { AuthGuard } from '../security/guards/auth.guard';
import { ApiDocs } from '../../shared/api-docs';
import { loginDocs, logoutDocs, refreshTokensDocs } from '../docs/auth.docs';
import { Auth_Service, Jwt_Service } from '../../shared/tokens';
import { AuthService } from '../../application/services/auth.service';
import { JwtService } from '../../infrastructure/services/jwt.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    @Inject(Auth_Service)
    private readonly authService: AuthService,
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiDocs(loginDocs)
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
    const response = await this.authService.login(loginDto);
    const refreshToken = this.jwtService.createToken(response.id, response.email, 'refreshToken');
    this.setCookies(res, refreshToken);

    res.status(HttpStatus.OK).send(response);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiDocs(refreshTokensDocs)
  async refreshAccessToken(@Cookies('refreshToken') token: string, @Res() res: Response) {
    const dto = await this.authService.refresh(token);
    const refreshToken = this.jwtService.createToken(dto.id, dto.email, 'refreshToken');
    this.setCookies(res, refreshToken);
    res.status(HttpStatus.OK).send(dto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiDocs(logoutDocs)
  @UseGuards(AuthGuard)
  async logout(@Req() @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.setHeader('Authorization', '');
    res.status(HttpStatus.OK).send({});
  }

  private setCookies(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
