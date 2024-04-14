import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateAccessToken(userId: number, userEmail: string) {
    return sign(
      {
        sub: userId,
        email: userEmail,
      },
      this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      { expiresIn: '10m' },
    );
  }

  generateRefreshToken(userId: number, userEmail: string) {
    return sign(
      {
        sub: userId,
        email: userEmail,
      },
      this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      {
        expiresIn: '60m',
      },
    );
  }

  generateActivationToken(userId: number, userEmail: string) {
    return sign(
      {
        sub: userId,
        email: userEmail,
      },
      this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      {
        expiresIn: '24h',
      },
    );
  }

  validateAccessToken(accessToken: string) {
    return verify(accessToken, this.configService.getOrThrow('JWT_ACCESS_SECRET'));
  }

  validateRefreshToken(refreshToken: string) {
    return verify(refreshToken, this.configService.getOrThrow('JWT_REFRESH_SECRET'));
  }
}