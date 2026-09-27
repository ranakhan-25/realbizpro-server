import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtMobileAuthGuard extends AuthGuard(
  'mobile-jwt',
) {
  constructor(
    private readonly reflector: Reflector,
  ) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ) {
    return super.canActivate(context);
  }

  override handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    const authenticatedUser = super.handleRequest(
      err,
      user,
      info,
      context,
    );

    if (
      authenticatedUser?.authType &&
      String(authenticatedUser.authType)
        .trim()
        .toLowerCase() !== 'mobile'
    ) {
      throw new ForbiddenException(
        'Only mobile tokens are allowed',
      );
    }

    return authenticatedUser;
  }
}
