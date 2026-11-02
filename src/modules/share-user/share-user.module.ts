import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShareUser } from '../../database/models/share-user/share-user.model';
import { ShareUserController } from './share-user.controller';
import { ShareUserService } from './share-user.service';
import { ShareUserAuthGuard } from './share-user-auth.guard';
import { ShareUserRoleGuard } from './share-user-role.guard';
import { SysUser } from '../../database/models/system/sys_user.model';

@Module({
  imports: [ConfigModule, JwtModule.register({}), SequelizeModule.forFeature([ShareUser, SysUser])],
  controllers: [ShareUserController],
  providers: [ShareUserService, ShareUserAuthGuard, ShareUserRoleGuard],
  exports: [ShareUserService, ShareUserAuthGuard, ShareUserRoleGuard],
})
export class ShareUserModule {}
