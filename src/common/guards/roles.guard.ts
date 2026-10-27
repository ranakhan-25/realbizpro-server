import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User session required for role verification');
    }

    // Super Admin has universal access
    if (user.isSuperUser === true || user.role === 'super-admin' || user.roles?.includes('super-admin')) {
      return true;
    }

    // Determine calling user roles
    const userRoles: string[] = [];
    if (user.role) userRoles.push(user.role);
    if (Array.isArray(user.roles)) userRoles.push(...user.roles);
    if (user.isOrgAdmin) userRoles.push('org-admin');

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Required role (${requiredRoles.join(', ')}) missing from user credentials`,
      );
    }

    return true;
  }
}
