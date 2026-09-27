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
}

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
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
    // 1. Check if token is blacklisted in cache
    if (
      payload.jti &&
      (await this.authService.isTokenBlacklisted(
        payload.jti,
      ))
    ) {
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
      throw new UnauthorizedException(
        'User is inactive or not found',
      );
    }

    return {
      ...user,
      authType: payload.authType,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
