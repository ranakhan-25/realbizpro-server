import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const SHARE_USER_ROLES_KEY = 'shareUserRoles';
export const ShareUserRoles = (...roles: string[]) => SetMetadata(SHARE_USER_ROLES_KEY, roles);

@Injectable()
export class ShareUserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(SHARE_USER_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const user = context.switchToHttp().getRequest().user;
    if (!user || !roles.includes(user.role)) throw new ForbiddenException('Share Project permission denied');
    return true;
  }
}
