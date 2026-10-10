import {
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';

import {
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';

import { HMAC_AUTH } from '../constants/hmac.constants';

export const HmacAuth = () =>
  applyDecorators(
    SetMetadata(HMAC_AUTH, true),

    ApiOperation({
      summary: 'HMAC Authentication',
    }),

    ApiHeader({
      name: 'x-timestamp',
      required: true,
    }),

    ApiHeader({
      name: 'x-signature',
      required: true,
    }),
  );
