import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../modules/engine/user-management/users/users.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { CacheService } from '../services/cache.service';

// Define the user type that matches your JWT payload
interface JwtPayload {
  id: number;
  // Add other properties you expect in the JWT payload
  email?: string;
  username?: string;
  isSuperUser?: boolean;
}

// Extend Express Request type
interface AuthenticatedRequest
  extends Express.Request {
  user: JwtPayload;
}

@Injectable()
export class PermissionsGuard extends AuthGuard(
  'jwt',
) {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private cacheService: CacheService,
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

    // JWT validation if not already authenticated by an upstream guard
    if (!request.user) {
      const jwtValid = (await super.canActivate(
        context,
      )) as boolean;
      if (!jwtValid) {
        return false;
      }
    }

    // Get required permissions
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (
      !requiredPermissions ||
      requiredPermissions.length === 0
    ) {
      return true; // No specific permissions needed, just JWT auth
    }

    // Check user permissions - now TypeScript knows request.user has an id
    const user = request.user;

    if (!user || !user.id) {
      return false; // No user in request
    }

    if (user.isSuperUser || (user as any).isOrgAdmin) {
      console.log(
        '[PermissionsGuard] 🚀 Access granted: User is a superuser.',
      );
      return true;
    }

    const hasPermissions =
      await this.hasRequiredPermissions(
        user.id,
        requiredPermissions,
      );

    if (!hasPermissions) {
      console.log(
        '[PermissionsGuard] ❌ Access denied: User is missing required permissions.',
      );
    }

    return hasPermissions;
  }

  private async hasRequiredPermissions(
    userId: number,
    required: string[],
  ): Promise<boolean> {
    return await this.getUserPermissions(
      userId,
      required,
    );
  }

  private async getUserPermissions(
    userId: number,
    required: string[],
  ): Promise<boolean> {
    return this.usersService.checkUserHasPermissions(
      userId,
      required,
    );
  }
}
