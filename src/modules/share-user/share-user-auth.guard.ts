import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { ShareUser, ShareUserStatus } from '../../database/models/share-user/share-user.model';
import { SysUser } from '../../database/models/system/sys_user.model';

@Injectable()
export class ShareUserAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(ShareUser) private readonly shareUserModel: typeof ShareUser,
    @InjectModel(SysUser) private readonly sysUserModel: typeof SysUser,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers?.authorization;
    if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedException('Share User authentication required');
    try {
      const secret =
        this.configService.get<string>('SHARE_PROJECT_JWT_SECRET') ||
        'share-project-development-secret';
      const payload = await this.jwtService.verifyAsync(authorization.slice(7), {
        secret,
      });
      if (payload.authType !== 'share-user') throw new UnauthorizedException('Invalid Share User token');
      const user = await this.shareUserModel.findByPk(payload.sub);
      if (!user || user.status === ShareUserStatus.BLOCKED || user.deletedAt) throw new UnauthorizedException('Share User is inactive');
      request.user = {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        role: user.role,
        authType: 'share-user',
      };
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      return this.verifyRealbizAdmin(context, authorization.slice(7));
    }
  }

  private async verifyRealbizAdmin(context: ExecutionContext, token: string): Promise<boolean> {
    const secrets = [
      this.configService.get<string>('JWT_SECRET'),
      this.configService.get<string>('security.jwtSecret'),
      'fallback-secret-key',
      'default_jwt_secret',
    ].filter((secret, index, values): secret is string => !!secret && values.indexOf(secret) === index);

    let payload: any;
    for (const secret of secrets) {
      try {
        payload = await this.jwtService.verifyAsync(token, { secret });
        break;
      } catch {}
    }
    if (!payload?.sub) throw new UnauthorizedException('Invalid Share User token');

    const admin = await this.sysUserModel.findByPk(payload.sub);
    if (!admin || admin.isActive === false || admin.isSuperUser !== true) {
      throw new ForbiddenException('Share Project permission denied');
    }

    let reviewer = await this.shareUserModel.findOne({
      where: { role: 'super-admin', status: ShareUserStatus.ACTIVE },
    });
    if (!reviewer) {
      reviewer = await this.shareUserModel.findOne({
        where: { role: 'super-admin' },
      });
      if (reviewer) {
        await reviewer.update({ status: ShareUserStatus.ACTIVE });
      } else {
        reviewer = await this.shareUserModel.create({
          name: (admin as any).name || 'Share Project Super Admin',
          email: admin.email || 'admin@shareproject.com',
          passwordHash: admin.password || 'managed-by-realbiz-admin',
          role: 'super-admin' as any,
          status: ShareUserStatus.ACTIVE,
          emailVerified: true,
        } as any);
      }
    }

    const request = context.switchToHttp().getRequest();
    request.user = {
      id: reviewer.id,
      uuid: reviewer.uuid,
      email: admin.email,
      role: 'super-admin',
      authType: 'realbiz-admin',
    };
    return true;
  }
}
