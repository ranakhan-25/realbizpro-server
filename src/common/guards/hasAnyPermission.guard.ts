import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../modules/engine/user-management/users/users.service';
import { ANY_PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

interface JwtPayload {
  id: number;
  email?: string;
  username?: string;
  isSuperUser?: boolean;
}

interface AuthenticatedRequest
  extends Express.Request {
  user: JwtPayload;
}

@Injectable()
export class HasAnyPermissionGuard extends AuthGuard(
  'jwt',
) {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {
    super();
  }

  override async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    // Check if route is marked as public
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (isPublic) {
      return true;
    }

    // JWT validation first
    const jwtValid = (await super.canActivate(
      context,
    )) as boolean;
    if (!jwtValid) {
      return false;
    }

    // Get required permissions (any of these will allow access)
    const targetPermissions =
      this.reflector.getAllAndOverride<string[]>(
        ANY_PERMISSIONS_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (
      !targetPermissions ||
      targetPermissions.length === 0
    ) {
      return true; // No specific permissions needed, just JWT auth
    }

    const user = request.user;
    if (!user || !user.id) {
      return false; // No user in request
    }

    if (user.isSuperUser || (user as any).authType === 'share-user') {
      console.log(
        '[HasAnyPermissionGuard] 🚀 Access granted: User is a superuser.',
      );
      return true;
    }

    const hasAnyPermission =
      await this.usersService.checkUserHasAnyPermission(
        user.id,
        targetPermissions,
      );

    if (!hasAnyPermission) {
      console.log(
        '[HasAnyPermissionGuard] ❌ Access denied: User is missing any of the required permissions.',
      );
    }

    return hasAnyPermission;
  }
}
