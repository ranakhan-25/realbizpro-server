import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { HmacService } from './services/hmac.service';
import { HmacAuthGuard } from './guards/hmac-auth.guard';

@Module({
  providers: [
    HmacService,
    {
      provide: APP_GUARD,
      useClass: HmacAuthGuard,
    },
  ],
  exports: [HmacService],
})
export class HmacAuthModule {}
