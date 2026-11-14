import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { AllConfigType } from '../types/config.type';
import { UsersService } from '@/modules/engine/user-management/users/users.service';
import { AuthService } from '../../modules/user-management/auth/auth.service';
import { JwtAuthUser } from '../types/jwt-user.type';

interface JwtPayload {
  sub: number;
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
  jti?: string;
  authType?: string;
  organization?: any;
  orgId?: number;
  isSuperUser?: boolean;
  roles?: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  // In-memory token validation cache to eliminate repeated remote WAN queries across bursts (TTL: 30s)
  private readonly sessionCache = new Map<string, { user: JwtAuthUser; expiresAt: number }>();

  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService, // Inject AuthService via forwardRef
  ) {
    const jwtSecret =
      configService.getOrThrow<string>(
        'security.jwtSecret',
        {
          infer: true,
        },
      );

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<JwtAuthUser> {
    const cacheKey = `${payload.sub}:${payload.orgId ?? ''}:${payload.isSuperUser ?? ''}:${payload.jti || payload.iat || ''}`;
    const cached = this.sessionCache.get(cacheKey);
    if (cached) {
      if (Date.now() < cached.expiresAt) {
        return cached.user;
      }
      this.sessionCache.delete(cacheKey);
    }

    // 1. Check if token is blacklisted in cache
    if (
      payload.jti &&
      (await this.authService.isTokenBlacklisted(
        payload.jti,
      ))
    ) {
      this.sessionCache.delete(cacheKey);
      throw new UnauthorizedException(
        'Token has been revoked',
      );
    }

    // 2. Check if token exists and is valid in database
    if (payload.jti) {
      const isTokenValid =
        await this.authService.validateTokenInDb(
          payload.jti,
        );
      if (!isTokenValid) {
        this.sessionCache.delete(cacheKey);
        throw new UnauthorizedException(
          'Token is invalid or expired',
        );
      }
    }

    // 3. Find user and check if active
    const user =
      await this.usersService.findBasicUser(
        payload.sub,
      );

    if (!user || !user.isActive) {
      this.sessionCache.delete(cacheKey);
      throw new UnauthorizedException(
        'User is inactive or not found',
      );
    }

    const authUser: JwtAuthUser = {
      ...user,
      username: payload.username ?? user.username,
      isSuperUser: payload.isSuperUser !== undefined ? payload.isSuperUser : user.isSuperUser,
      roles: payload.roles !== undefined ? payload.roles : (user as any).roles,
      organization: payload.organization !== undefined ? payload.organization : (user as any).organization,
      orgId: payload.organization?.id ?? (payload.orgId !== undefined ? payload.orgId : user.orgId),
      authType: payload.authType,
      iat: payload.iat,
      exp: payload.exp,
    };

    // Cache verified session for 30 seconds
    this.sessionCache.set(cacheKey, {
      user: authUser,
      expiresAt: Date.now() + 30000,
    });

    return authUser;
  }
}
