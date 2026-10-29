/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { Op } from 'sequelize';
import { CacheService } from '../../../common/services/cache.service';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysUserToken } from '../../../database/models/system/sys_user_token.model';
import { AuthResponseDto } from './dto/auth-response.dto';
import {
  ChangePasswordDto,
  RefreshTokenDto,
  UpdateProfileDto,
} from './dto/common.dto';
import { DemoBookDto } from './dto/demo-book.dto';
import {
  DemoBookQueryDto,
  UpdateDemoBookMeetingTimeDto,
} from './dto/demo-book-query.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SysPermission } from '@/database/models/system/sys_permission.model';
import { SysUserPermission } from '@/database/models/system/sys_user_permission.model';
import { SysOrganization } from '@/database/models/system/sys_organization.model';
import { SysRole } from '@/database/models/system/sys_role.model';
import { DemoBook } from '@/database/models/system/sys_demo_book.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SysUser)
    private userModel: typeof SysUser,
    @InjectModel(SysUserToken)
    private userTokenModel: typeof SysUserToken,
    @InjectModel(SysPermission)
    private permissionModel: typeof SysPermission,
    @InjectModel(SysUserPermission)
    private userPermissionModel: typeof SysUserPermission,
    @InjectModel(SysOrganization)
    private orgModel: typeof SysOrganization,
    @InjectModel(SysRole)
    private roleModel: typeof SysRole,
    @InjectModel(DemoBook)
    private demoBookModel: typeof DemoBook,
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  private getRefreshTokenKey(
    userId: number,
  ): string {
    return `refresh:${userId}`;
  }

  private getBlacklistKey(jti: string): string {
    return `blacklist:${jti}`;
  }

  async login(
    loginDto: LoginDto,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    // Find user by email or username
    const user = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { email: username },
          { username: username },
        ],
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    // Verify password with argon2
    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    // Check organization lock & subscription status (unless super admin)
    if (user.orgId && !user.isSuperUser) {
      const org = await this.orgModel.findByPk(
        user.orgId,
      );
      if (org) {
        if (org.isLocked) {
          throw new UnauthorizedException(
            org.lockReason ||
              'Organization account is currently locked. Please contact your administrator.',
          );
        }
        if (
          org.subscriptionEndDate &&
          new Date() >
            new Date(org.subscriptionEndDate)
        ) {
          throw new UnauthorizedException(
            'Organization subscription has expired. Please renew your subscription to access.',
          );
        }
      }
    }

    // Generate tokens
    const tokens = await this.generateTokens(
      user,
      metadata,
    );

    // Update last login and refresh token in DB
    await user.update({
      lastLoginAt: new Date(),
      refreshToken: tokens.refreshToken,
      refreshTokenExpiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ), // 7 days
    });

    return tokens;
  }

  async createDemoBook(
    dto: DemoBookDto,
  ): Promise<DemoBook> {
    return this.demoBookModel.create({
      ...dto,
    });
  }

  async findAllDemoBooks(
    query: DemoBookQueryDto,
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      dateFrom,
      dateTo,
    } = query;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (search) {
      const like = `%${search}%`;
      where[Op.or] = [
        { organizationName: { [Op.like]: like } },
        {
          organizationEmail: { [Op.like]: like },
        },
        {
          contactPersonName: { [Op.like]: like },
        },
        { tradeLicense: { [Op.like]: like } },
      ];
    }

    if (dateFrom || dateTo) {
      where.demoDate = {};
      if (dateFrom) {
        where.demoDate[Op.gte] = dateFrom;
      }
      if (dateTo) {
        where.demoDate[Op.lte] = dateTo;
      }
    }

    const { rows, count } =
      await this.demoBookModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOneDemoBook(uuid: string) {
    const booking =
      await this.demoBookModel.findOne({
        where: { uuid },
      });

    if (!booking) {
      throw new NotFoundException(
        'Demo booking not found',
      );
    }

    return booking;
  }

  async updateDemoBookMeetingTime(
    uuid: string,
    updateDto: UpdateDemoBookMeetingTimeDto,
  ) {
    const booking =
      await this.findOneDemoBook(uuid);

    await booking.update({
      meetingTime: updateDto.meetingTime,
    });

    return booking.reload();
  }

  async register(
    registerDto: RegisterDto,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<AuthResponseDto> {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      phone,
    } = registerDto;

    const existingUser =
      await this.userModel.findOne({
        where: { email },
      });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists',
      );
    }

    if (username) {
      const existingUsername =
        await this.userModel.findOne({
          where: { username },
        });

      if (existingUsername) {
        throw new ConflictException(
          'Username already taken',
        );
      }
    }

    if (phone) {
      const existingPhone =
        await this.userModel.findOne({
          where: { phone },
        });
      if (existingPhone) {
        throw new ConflictException(
          'Phone number already in use',
        );
      }
    }

    const passwordHash =
      await argon2.hash(password);

    try {
      const user = await this.userModel.create({
        name:
          `${firstName || ''} ${lastName || ''}`.trim() ||
          username ||
          email,
        email,
        password: passwordHash,
        username,
        passwordHash,
        firstName,
        lastName,
        phone,
        isActive: true,
        isSuperUser: false,
      });

      const tokens = await this.generateTokens(
        user,
        metadata,
      );
      await user.update({
        refreshToken: tokens.refreshToken,
        refreshTokenExpiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ),
      });

      return tokens;
    } catch (error) {
      console.log({
        error,
      });

      throw new BadRequestException(
        'Failed to create user',
      );
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    // Find user by refresh token
    const user = await this.userModel.findOne({
      where: { refreshToken, isActive: true },
    });

    if (!user || !user.isRefreshTokenValid()) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // Validate against Redis cache
    const cachedToken =
      await this.cacheService.get<string>(
        this.getRefreshTokenKey(user.id),
        { prefix: 'auth' },
      );

    if (cachedToken !== refreshToken) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // Generate new tokens
    const tokens = await this.generateTokens(
      user,
      metadata,
    );

    // Update refresh token in DB and cache
    await user.update({
      refreshToken: tokens.refreshToken,
      refreshTokenExpiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ),
    });

    return tokens;
  }

  // ─────────────────────────────────────────────
  // ✅ UPDATED: oldPassword + newPassword + confirmPassword
  // ─────────────────────────────────────────────
  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = dto;

    // 1. Confirm match (DTO validator already checks, extra safety)
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    // 2. Old != new
    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    // 3. Find user
    const user =
      await this.userModel.findByPk(userId);
    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    // 4. Verify old password (argon2)
    const storedHash =
      user.passwordHash || user.password;
    const isOldValid = await argon2.verify(
      storedHash,
      oldPassword,
    );
    if (!isOldValid) {
      throw new UnauthorizedException(
        'Old password is incorrect',
      );
    }

    // 5. Hash new password
    const newPasswordHash =
      await argon2.hash(newPassword);

    // 6. Save + revoke sessions
    await user.update({
      passwordHash: newPasswordHash,
      refreshToken: null,
      refreshTokenExpiresAt: null,
    });

    await this.userTokenModel.destroy({
      where: { userId },
    });

    await this.cacheService.del(
      this.getRefreshTokenKey(userId),
      { prefix: 'auth' },
    );
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<SysUser> {
    const {
      username,
      email,
      firstName,
      lastName,
      phone,
    } = updateProfileDto;

    const user =
      await this.userModel.findByPk(userId);
    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    // Check if email is being changed and is available
    if (email && email !== user.email) {
      const existingEmail =
        await this.userModel.findOne({
          where: { email },
        });
      if (existingEmail) {
        throw new ConflictException(
          'Email already in use',
        );
      }
    }

    // Check if username is being changed and is available
    if (username && username !== user.username) {
      const existingUsername =
        await this.userModel.findOne({
          where: { username },
        });
      if (existingUsername) {
        throw new ConflictException(
          'Username already taken',
        );
      }
    }

    // Update user
    await user.update({
      username,
      email,
      firstName,
      lastName,
      phone,
    });
    return user.reload();
  }

  async logout(
    userId: number,
    accessToken?: string,
  ): Promise<void> {
    // Revoke refresh token
    await this.userModel.update(
      {
        refreshToken: null,
        refreshTokenExpiresAt: null,
        lastLogoutAt: new Date(),
      },
      { where: { id: userId } },
    );

    // Clear from cache
    await this.cacheService.del(
      this.getRefreshTokenKey(userId),
      {
        prefix: 'auth',
      },
    );

    // Optionally blacklist the access token and soft delete from DB
    if (accessToken) {
      type JwtPayload = {
        jti?: string;
        exp?: number;
      };

      const decoded =
        this.jwtService.decode<JwtPayload>(
          accessToken,
        );

      if (decoded?.jti) {
        // Soft delete from DB
        await this.userTokenModel.destroy({
          where: { jti: decoded.jti },
        });

        if (decoded?.exp) {
          const ttl =
            decoded.exp -
            Math.floor(Date.now() / 1000);

          if (ttl > 0) {
            await this.cacheService.set(
              this.getBlacklistKey(decoded.jti),
              'blacklisted',
              { ttl, prefix: 'auth' },
            );
          }
        }
      }
    }
  }

  async logoutAll(userId: number): Promise<void> {
    // Revoke all refresh tokens for this user
    await this.userModel.update(
      {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      },
      { where: { id: userId } },
    );

    // Delete all tokens from DB
    await this.userTokenModel.destroy({
      where: { userId },
    });

    // Clear from cache
    await this.cacheService.del(
      this.getRefreshTokenKey(userId),
      {
        prefix: 'auth',
      },
    );
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

  private async generateTokens(
    user: SysUser,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<AuthResponseDto> {
    const jti = randomBytes(16).toString('hex');

    // Fetch user roles
    const userWithRoles =
      await this.userModel.findByPk(user.id, {
        include: [
          {
            association: 'roles',
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });
    const roleSlugs = (
      userWithRoles?.roles || []
    ).map((r) => r.slug);
    const primaryRole = user.isSuperUser
      ? 'super-admin'
      : user.isOrgAdmin
        ? 'org-admin'
        : roleSlugs[0] || 'user';

    const payload = {
      sub: user.id,
      userId: user.uuid,
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      orgId: user.orgId || null,
      orgUuid: user.orgUuid || null,
      role: primaryRole,
      roles: roleSlugs,
      isSuperUser: !!user.isSuperUser,
      isOrgAdmin: !!user.isOrgAdmin,
      jti,
      authType: 'web',
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    const refreshToken =
      randomBytes(32).toString('hex');

    await this.cacheService.set(
      this.getRefreshTokenKey(user.id),
      refreshToken,
      {
        ttl: 7 * 24 * 60 * 60,
        prefix: 'auth',
      },
    );

    type JwtPayload = {
      iat?: number;
      exp?: number;
    };

    const decoded =
      this.jwtService.decode<JwtPayload>(
        accessToken,
      );

    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 3600 * 1000);

    // Store in DB
    await this.userTokenModel.create({
      userId: user.id,
      token: accessToken,
      jti,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn:
        decoded?.exp && decoded?.iat
          ? decoded.exp - decoded.iat
          : 3600,
      iat: decoded?.iat,
      exp: decoded?.exp,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        username: user.username,
        orgId: user.orgId || null,
        orgUuid: user.orgUuid || null,
        role: primaryRole,
        roles: roleSlugs,
        isSuperUser: !!user.isSuperUser,
        isOrgAdmin: !!user.isOrgAdmin,
      },
    };
  }

  async getUserData(
    userId: number,
  ): Promise<any> {
    const user = await this.userModel.findOne({
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
          through: { attributes: [] },
        },
        {
          association: 'modules',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          association: 'permissions',
          attributes: ['id', 'key', 'name'],
          through: { attributes: [] },
        },
        {
          association: 'avatar',
          attributes: [
            'id',
            'fileName',
            'filePath',
            'mimeType',
          ],
        },
        {
          association: 'organization',
          attributes: [
            'id',
            'name',
            'code',
            'email',
            'phone',
          ],
        },
        {
          association: 'companies',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      throw new UnauthorizedException(
        'Sorry you are not authorized user',
      );
    }

    return {
      ...user.toJSON(),
      permissions: user.permissions ?? [],
    };
  }

  async validateUser(
    userId: number,
  ): Promise<SysUser | null> {
    return this.userModel.findOne({
      where: { id: userId, isActive: true },
    });
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

  async findByEmail(
    email: string,
  ): Promise<SysUser | null> {
    return this.userModel.findOne({
      where: { email },
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

  /**
   * Get user permissions directly from user permissions table
   */
  async getUserDirectPermissions(
    userId: number,
  ): Promise<string[]> {
    const user = await this.userModel.findByPk(
      userId,
      {
        include: [
          {
            association: 'userPermissions',
            include: [
              {
                association: 'permission',
                attributes: ['key'],
              },
            ],
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

    // Collect all unique permission keys from user permissions
    const permissionKeys = new Set<string>();

    for (const userPermission of user.userPermissions ||
      []) {
      if (userPermission.permission?.key) {
        permissionKeys.add(
          userPermission.permission.key,
        );
      }
    }

    return Array.from(permissionKeys);
  }
}
