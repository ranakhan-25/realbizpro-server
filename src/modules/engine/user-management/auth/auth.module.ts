import {
  Module,
  forwardRef,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtStrategy } from '../../../../common/strategies/jwt.strategy';
import { JwtMobileStrategy } from '../../../../common/strategies/jwt-mobile.strategy';
import { AuthModule as UserManagementAuthModule } from '../../../../modules/user-management/auth/auth.module';
import { AuthService } from './auth.service';
import { SysUserToken } from '@/database/models/system/sys_user_token.model';
import { SysUser } from '../../../../database/models/system/sys_user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysUser,
      SysUserToken,
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
      ) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'fallback-secret-key',
        ),
        signOptions: {
          expiresIn: Number(
            configService.get<number>(
              'JWT_EXPIRES_IN',
              86400,
            ),
          ),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserManagementAuthModule),
  ],
  controllers: [],
  providers: [
    AuthService,
    JwtStrategy,
    JwtMobileStrategy,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
