import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectConnection } from '@nestjs/sequelize';
import { createHash } from 'crypto';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { Sequelize } from 'sequelize-typescript';

import { AllConfigType } from '../types/config.type';
import { UsersService } from '@/modules/engine/user-management/users/users.service';
import { AuthService } from '../../modules/user-management/auth/auth.service';
import { JwtAuthUser } from '../types/jwt-user.type';
import {
  ShareUser,
  ShareUserStatus,
} from '@/database/models/share-user/share-user.model';
import {
  OrgSubscriptionStatus,
  SysOrganization,
} from '@/database/models/system/sys_organization.model';

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
  private readonly sessionCache = new Map<
    string,
    { user: JwtAuthUser; expiresAt: number }
  >();

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService, // Inject AuthService via forwardRef
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {
    const jwtSecret =
      configService.getOrThrow<string>(
        'security.jwtSecret',
        {
          infer: true,
        },
      );
    const shareJwtSecret =
      configService.get<string>(
        'SHARE_PROJECT_JWT_SECRET' as any,
      ) || 'share-project-development-secret';

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        _request: any,
        rawJwtToken: string,
        done: (
          err: any,
          secretOrKey?: string | Buffer,
        ) => void,
      ) => {
        try {
          const parts = rawJwtToken?.split('.');
          if (parts?.length === 3) {
            const decoded = JSON.parse(
              Buffer.from(
                parts[1],
                'base64url',
              ).toString('utf8'),
            );
            if (
              decoded?.authType === 'share-user'
            ) {
              return done(null, shareJwtSecret);
            }
          }
        } catch {
          // Fall back to default ERP JWT secret
        }
        return done(null, jwtSecret);
      },
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<JwtAuthUser> {
    const cacheKey = `${payload.authType || 'sys'}:${payload.sub}:${payload.orgId ?? ''}:${payload.isSuperUser ?? ''}:${payload.jti || payload.iat || ''}`;
    const cached = this.sessionCache.get(cacheKey);
    if (cached) {
      if (Date.now() < cached.expiresAt) {
        return cached.user;
      }
      this.sessionCache.delete(cacheKey);
    }

    if (payload.authType === 'share-user') {
      return this.validateShareUser(
        payload,
        cacheKey,
      );
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
      isSuperUser:
        payload.isSuperUser !== undefined
          ? payload.isSuperUser
          : user.isSuperUser,
      roles:
        payload.roles !== undefined
          ? payload.roles
          : user.roles,
      organization:
        payload.organization !== undefined
          ? payload.organization
          : user.organization,
      orgId:
        payload.organization?.id ??
        (payload.orgId !== undefined
          ? payload.orgId
          : user.orgId),
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

  private async validateShareUser(
    payload: JwtPayload,
    cacheKey: string,
  ): Promise<JwtAuthUser> {
    const shareUserModel = this.sequelize.model(
      ShareUser,
    ) as typeof ShareUser;
    const shareUser =
      await shareUserModel.findByPk(payload.sub);

    if (
      !shareUser ||
      shareUser.deletedAt ||
      shareUser.status === ShareUserStatus.BLOCKED
    ) {
      this.sessionCache.delete(cacheKey);
      throw new UnauthorizedException(
        'Share User is inactive or not found',
      );
    }

    const normalizedEmail = (
      shareUser.email || ''
    )
      .trim()
      .toLowerCase();
    if (!normalizedEmail) {
      throw new UnauthorizedException(
        'Share User email is required',
      );
    }

    const orgCode =
      'SHARE-' +
      createHash('sha256')
        .update(normalizedEmail)
        .digest('hex')
        .slice(0, 16)
        .toUpperCase();

    const orgModel = this.sequelize.model(
      SysOrganization,
    ) as typeof SysOrganization;
    let org = await orgModel.findOne({
      where: { code: orgCode },
    });

    if (!org) {
      try {
        org = await orgModel.create({
          name: shareUser.name || normalizedEmail,
          code: orgCode,
          email: normalizedEmail,
          phone: shareUser.phone ?? undefined,
          subscriptionStatus:
            OrgSubscriptionStatus.ACTIVE,
          maxUsers: 999999,
          maxProjects: 999999,
        });
      } catch {
        org = await orgModel.findOne({
          where: { code: orgCode },
        });
      }
    }

    if (!org) {
      throw new UnauthorizedException(
        'Unable to initialize organization scope for Share User',
      );
    }

    const authUser: JwtAuthUser = {
      id: shareUser.id,
      shareUserId: shareUser.id,
      shareUserUuid: shareUser.uuid,
      // Do not populate SysUser.uuid here because some tables have FKs to sys_users.uuid
      uuid: undefined,
      username: normalizedEmail,
      firstName: shareUser.name,
      lastName: '',
      email: normalizedEmail,
      phone: shareUser.phone ?? null,
      isActive: true,
      isSuperUser: false,
      isOrgAdmin: true,
      orgId: org.id,
      orgUuid: org.uuid,
      organization: org.toJSON
        ? org.toJSON()
        : org,
      role: shareUser.role,
      roles: ['org-admin', shareUser.role].filter(
        Boolean,
      ),
      authType: 'share-user',
      iat: payload.iat,
      exp: payload.exp,
    };

    this.sessionCache.set(cacheKey, {
      user: authUser,
      expiresAt: Date.now() + 30000,
    });

    return authUser;
  }
}
