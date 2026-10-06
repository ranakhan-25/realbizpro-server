import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ANY_PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  'jwt',
) {
  constructor(
    private readonly reflector: Reflector,
  ) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    if (user?.authType === 'mobile') {
      const requiredPermissions =
        this.reflector.getAllAndOverride<
          string[]
        >(PERMISSIONS_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
      const anyPermissions =
        this.reflector.getAllAndOverride<
          string[]
        >(ANY_PERMISSIONS_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

      if (
        (requiredPermissions &&
          requiredPermissions.length > 0) ||
        (anyPermissions &&
          anyPermissions.length > 0)
      ) {
        throw new ForbiddenException(
          'Mobile token cannot access permission-protected endpoints',
        );
      }
    }

    return super.handleRequest(
      err,
      user,
      info,
      context,
    );
  }
}
