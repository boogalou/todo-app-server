import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../../../application/services/jwt.service';
import { JwtToken } from '../../../shared/types';

const JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET';
const JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';
const JWT_URL_SECRET = 'JWT_URL_SECRET';

@Injectable()
export class JwtServiceImpl implements JwtService {
  constructor(private readonly configService: ConfigService) {}

  async validateToken(token: string, tokenType: JwtToken) {
    let secret: string;

    switch (tokenType) {
      case JwtToken.ACCESS_TOKEN:
        secret = this.configService.getOrThrow(JWT_ACCESS_SECRET);
        break;
      case JwtToken.REFRESH_TOKEN:
        secret = this.configService.getOrThrow(JWT_REFRESH_SECRET);
        break;
      case JwtToken.URL_TOKEN:
        secret = this.configService.getOrThrow(JWT_URL_SECRET);
        break;
      default:
        throw new BadRequestException('Wrong token type');
    }

    try {
      return verify(token, secret);
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

  createToken(userId: number, userEmail: string, tokenType: JwtToken) {
    const payload = {
      sub: userId,
      email: userEmail,
    };

    const { secret, expiresIn } = this.getTokenClaims(tokenType);

    return sign(payload, this.configService.getOrThrow(secret), {
      expiresIn,
    });
  }

  private getTokenClaims(tokenType: JwtToken) {
    switch (tokenType) {
      case JwtToken.ACCESS_TOKEN:
        return {
          secret: JWT_ACCESS_SECRET,
          expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRE'),
        };
      case JwtToken.REFRESH_TOKEN:
        return {
          secret: JWT_REFRESH_SECRET,
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRE'),
        };
      case JwtToken.URL_TOKEN:
        return {
          secret: JWT_URL_SECRET,
          expiresIn: this.configService.get('URL_TOKEN_EXPIRE'),
        };
      default:
        throw new Error('Invalid token type');
    }
  }
}
