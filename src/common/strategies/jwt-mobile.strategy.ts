import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { AllConfigType } from '../types/config.type';

interface JwtMobilePayload {
  sub: number;
  employeeId?: number | string;
  employeeCode?: string;
  iat?: number;
  exp?: number;
  authType?: string;
}

@Injectable()
export class JwtMobileStrategy extends PassportStrategy(
  Strategy,
  'mobile-jwt',
) {
  constructor(
    configService: ConfigService<AllConfigType>,
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

  async validate(payload: JwtMobilePayload) {
    const normalizedAuthType = payload.authType
      ?.trim()
      .toLowerCase();

    if (
      normalizedAuthType &&
      normalizedAuthType !== 'mobile'
    ) {
      throw new UnauthorizedException(
        'Invalid mobile token',
      );
    }

    return {
      id: payload.sub,
      employeeId: payload.employeeId,
      employeeCode: payload.employeeCode,
      authType: normalizedAuthType || 'mobile',
    };
  }
}
