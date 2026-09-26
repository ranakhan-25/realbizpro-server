import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { MobileUserController } from './mobile-user.controller';
import { MobileUserService } from './mobile-user.service';

@Module({
  imports: [SequelizeModule.forFeature([])],
  controllers: [MobileUserController],
  providers: [MobileUserService],
})
export class MobileUserModule {}
