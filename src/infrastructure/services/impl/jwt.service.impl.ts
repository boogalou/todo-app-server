import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../jwt.service';

export type TypeToken = 'accessToken' | 'refreshToken' | 'activationToken';
const JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET';
const JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';
const JWT_LINK_SECRET = 'JWT_LINK_SECRET';

@Injectable()
export class JwtServiceImpl implements JwtService {
  constructor(private readonly configService: ConfigService) {}

  async validateToken(token: string, tokenType: TypeToken) {
    const secret =
      tokenType === 'accessToken'
        ? this.configService.getOrThrow(JWT_ACCESS_SECRET)
        : tokenType === 'refreshToken'
          ? this.configService.getOrThrow(JWT_REFRESH_SECRET)
          : this.configService.getOrThrow(JWT_LINK_SECRET);

    try {
      return await verify(token, secret);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid JWT token');
      } else {
        throw new UnauthorizedException(`Unexpected token validation error: ${err}`);
      }
    }
  }

  createToken(userId: number, userEmail: string, tokenType: TypeToken) {
    const payload = {
      sub: userId,
      email: userEmail,
    };

    const { secret, expiresIn } = this.getTokenClaims(tokenType);

    return sign(payload, this.configService.getOrThrow(secret), {
      expiresIn,
    });
  }

  private getTokenClaims(tokenType: TypeToken) {
    switch (tokenType) {
      case 'accessToken':
        return {
          secret: JWT_ACCESS_SECRET,
          expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRE'),
        };
      case 'refreshToken':
        return {
          secret: JWT_REFRESH_SECRET,
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRE'),
        };
      case 'activationToken':
        return {
          secret: JWT_LINK_SECRET,
          expiresIn: this.configService.get('ACTIVATE_TOKEN_EXPIRE'),
        };
      default:
        throw new Error('Invalid token type');
    }
  }
}
