import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtRequest } from '../shared/types';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExtRequest>();
    if (request.user) {
      return true;
    }
    throw new UnauthorizedException('unauthorized');
  }
}
