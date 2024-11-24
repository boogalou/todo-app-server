import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDetails } from '../../../shared/types';

export const UserAuth = createParamDecorator(
  (data: keyof UserDetails | undefined, ctx: ExecutionContext): UserDetails | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
