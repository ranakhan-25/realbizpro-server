import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { HmacService } from '../services/hmac.service';

import {
  HMAC_AUTH,
  HMAC_EXPIRE_TIME,
  HMAC_HEADERS,
} from '../constants/hmac.constants';

@Injectable()
export class HmacAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly hmacService: HmacService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const isProtected =
      this.reflector.getAllAndOverride<boolean>(
        HMAC_AUTH,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!isProtected) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest();

    const timestamp = request.headers[
      HMAC_HEADERS.TIMESTAMP
    ] as string;

    const signature = request.headers[
      HMAC_HEADERS.SIGNATURE
    ] as string;

    if (!timestamp || !signature) {
      throw new UnauthorizedException(
        'Missing HMAC headers',
      );
    }

    if (
      Date.now() - Number(timestamp) >
      HMAC_EXPIRE_TIME
    ) {
      throw new UnauthorizedException(
        'Signature expired',
      );
    }

    const valid =
      this.hmacService.verifySignature(
        timestamp,
        signature,
      );

    if (!valid) {
      throw new UnauthorizedException(
        'Invalid signature',
      );
    }

    return true;
  }
}
