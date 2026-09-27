import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HrmMobileAuthFaceController } from './hrm-mobile-auth-face.controller';
import { HrmMobileAuthFaceService } from './hrm-mobile-auth-face.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    SequelizeModule.forFeature([]),
  ],
  controllers: [HrmMobileAuthFaceController],
  providers: [HrmMobileAuthFaceService],
  exports: [HrmMobileAuthFaceService],
})
export class HrmMobileAuthFaceModule {}
