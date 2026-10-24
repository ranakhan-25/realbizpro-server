import {
  forwardRef,
  Module,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import {
  JwtModule,
  JwtModuleOptions,
} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { JwtStrategy } from '../../../common/strategies/jwt.strategy';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysUserToken } from '../../../database/models/system/sys_user_token.model';
import { SysUserPermission } from '@/database/models/system/sys_user_permission.model';
import { SysOrganization } from '@/database/models/system/sys_organization.model';
import { SysRole } from '@/database/models/system/sys_role.model';
import { SysUserRole } from '@/database/models/system/sys_user_role.model';
import { MenuModule } from '../../menu/menu.module';
import { UsersModule } from '../../engine/user-management/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SysPermission } from '@/database/models/system/sys_permission.model';

@Module({
  imports: [
    ConfigModule, // ✅ required unless global

    SequelizeModule.forFeature([
      SysUser,
      SysUserToken,
      SysPermission,
      SysUserPermission,
      SysOrganization,
      SysRole,
      SysUserRole,
    ]),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): JwtModuleOptions => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'fallback-secret-key',
        ),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRES_IN',
            '1d',
          ) as unknown as number,
        },
      }),
    }),

    forwardRef(() => UsersModule),
    MenuModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],

  exports: [
    AuthService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
