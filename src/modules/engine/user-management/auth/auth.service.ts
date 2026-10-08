import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CacheService } from '../../../../common/services/cache.service';
import { SysUser } from '../../../../database/models/system/sys_user.model';
import { Op } from 'sequelize';
import { SysUserToken } from '@/database/models/system/sys_user_token.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SysUser)
    private userModel: typeof SysUser,
    @InjectModel(SysUserToken)
    private userTokenModel: typeof SysUserToken,
    private cacheService: CacheService,
  ) {}

  private getBlacklistKey(jti: string): string {
    return `blacklist:${jti}`;
  }

  async isTokenBlacklisted(
    jti: string,
  ): Promise<boolean> {
    const blacklisted =
      await this.cacheService.get(
        this.getBlacklistKey(jti),
        {
          prefix: 'auth',
        },
      );
    return !!blacklisted;
  }

  async validateTokenInDb(
    jti: string,
  ): Promise<boolean> {
    const token =
      await this.userTokenModel.findOne({
        where: {
          jti,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
      });

    return !!token;
  }

  async getUserData(
    userId: number,
  ): Promise<SysUser | null> {
    return this.userModel.findOne({
      where: { id: userId, isActive: true },
      attributes: {
        exclude: [
          'passwordHash',
          'refreshToken',
          'refreshTokenExpiresAt',
          'createdById',
          'deletedAt',
        ],
      },
      include: [
        {
          association: 'roles',
          attributes: [
            'id',
            'name',
            'description',
          ],
        },
        {
          association: 'modules',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          association: 'receivingPoint',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async validateUser(
    userId: number,
  ): Promise<SysUser | null> {
    return this.userModel.findOne({
      where: { id: userId, isActive: true },
    });
  }

  /**
   * Get user permissions from all assigned roles
   */
  async getUserPermissions(
    userId: number,
  ): Promise<string[]> {
    const user = await this.userModel.findByPk(
      userId,
      {
        include: [
          {
            association: 'roles',
            include: [
              {
                association: 'permissions',
                attributes: ['key'],
                through: { attributes: [] },
              },
            ],
            through: { attributes: [] },
          },
        ],
      },
    );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    // If user is super user, return all permissions
    if (user.isSuperUser) {
      return ['*']; // Special indicator for super user
    }

    // Collect all unique permission keys from all roles
    const permissionKeys = new Set<string>();

    for (const role of user.roles || []) {
      for (const permission of role.permissions ||
        []) {
        permissionKeys.add(permission.key);
      }
    }

    return Array.from(permissionKeys);
  }
}
