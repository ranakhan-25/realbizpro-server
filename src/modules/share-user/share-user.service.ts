import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { randomBytes, createHash } from 'crypto';
import { Op } from 'sequelize';
import { ShareUser, ShareUserRole, ShareUserStatus } from '../../database/models/share-user/share-user.model';
import {
  ChangeShareUserPasswordDto,
  ForgotShareUserPasswordDto,
  LoginShareUserDto,
  RefreshShareUserTokenDto,
  RegisterShareUserDto,
  ResetShareUserPasswordDto,
  UpdateShareUserProfileDto,
  VerifyShareUserEmailDto,
} from './dto/share-user-auth.dto';

@Injectable()
export class ShareUserService {
  constructor(
    @InjectModel(ShareUser) private readonly userModel: typeof ShareUser,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private get secret() {
    return this.configService.get<string>('SHARE_PROJECT_JWT_SECRET') || 'share-project-development-secret';
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async tokens(user: ShareUser) {
    const payload = { sub: user.id, uuid: user.uuid, email: user.email, role: user.role, authType: 'share-user' };
    const accessToken = await this.jwtService.signAsync(payload, { secret: this.secret, expiresIn: '1h' });
    const refreshToken = randomBytes(48).toString('hex');
    await user.update({ refreshTokenHash: this.hashToken(refreshToken), lastLoginAt: new Date() });
    return { accessToken, tokenType: 'Bearer', refreshToken, expiresIn: 3600, user: this.safeUser(user) };
  }

  private safeUser(user: ShareUser) {
    return {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }

  async register(dto: RegisterShareUserDto) {
    const existing = await this.userModel.findOne({ where: { [Op.or]: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])] } });
    if (existing) throw new ConflictException('A Share User with this email or phone already exists');
    const passwordHash = await argon2.hash(dto.password);
    const verificationToken = randomBytes(32).toString('hex');
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: ShareUserRole.OWNER,
      status: ShareUserStatus.PENDING,
      emailVerified: false,
      emailVerificationTokenHash: this.hashToken(verificationToken),
    } as any);
    return { message: 'Registration successful. Verify your email.', verificationToken: process.env.NODE_ENV === 'production' ? undefined : verificationToken, user: this.safeUser(user) };
  }

  async login(dto: LoginShareUserDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user || user.status === ShareUserStatus.BLOCKED) throw new UnauthorizedException('Invalid credentials');
    if (!(await argon2.verify(user.passwordHash, dto.password))) throw new UnauthorizedException('Invalid credentials');
    return this.tokens(user);
  }

  async logout(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('Share User not found');
    await user.update({ refreshTokenHash: null });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotShareUserPasswordDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user) return { message: 'If the account exists, reset instructions have been sent.' };
    const token = randomBytes(32).toString('hex');
    await user.update({ passwordResetTokenHash: this.hashToken(token), passwordResetExpiresAt: new Date(Date.now() + 30 * 60 * 1000) });
    return { message: 'If the account exists, reset instructions have been sent.', resetToken: process.env.NODE_ENV === 'production' ? undefined : token };
  }

  async resetPassword(dto: ResetShareUserPasswordDto) {
    const hash = this.hashToken(dto.token);
    const user = await this.userModel.findOne({ where: { passwordResetTokenHash: hash } });
    if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) throw new BadRequestException('Reset token is invalid or expired');
    await user.update({ passwordHash: await argon2.hash(dto.password), passwordResetTokenHash: null, passwordResetExpiresAt: null });
    return { message: 'Password reset successful' };
  }

  async verifyEmail(dto: VerifyShareUserEmailDto) {
    const hash = this.hashToken(dto.token);
    const user = await this.userModel.findOne({ where: { emailVerificationTokenHash: hash } });
    if (!user) throw new BadRequestException('Verification token is invalid');
    await user.update({ emailVerified: true, status: ShareUserStatus.ACTIVE, emailVerificationTokenHash: null });
    return { message: 'Email verified successfully' };
  }

  async refresh(dto: RefreshShareUserTokenDto) {
    const hash = this.hashToken(dto.refreshToken);
    const user = await this.userModel.findOne({ where: { refreshTokenHash: hash } });
    if (!user || user.status === ShareUserStatus.BLOCKED) throw new UnauthorizedException('Refresh token is invalid');
    return this.tokens(user);
  }

  async profile(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('Share User not found');
    return this.safeUser(user);
  }

  async updateProfile(userId: number, dto: UpdateShareUserProfileDto) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('Share User not found');
    await user.update(dto);
    return this.safeUser(user);
  }

  async changePassword(userId: number, dto: ChangeShareUserPasswordDto) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('Share User not found');
    if (!(await argon2.verify(user.passwordHash, dto.currentPassword))) throw new BadRequestException('Current password is incorrect');
    await user.update({ passwordHash: await argon2.hash(dto.newPassword), refreshTokenHash: null });
    return { message: 'Password changed successfully' };
  }

  async findAll(page = 1, limit = 10) {
    const { rows, count } = await this.userModel.findAndCountAll({ offset: (page - 1) * limit, limit, order: [['createdAt', 'DESC']] });
    return { data: rows.map((user) => this.safeUser(user)), meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async findOne(uuid: string) {
    const user = await this.userModel.findOne({ where: { uuid } });
    if (!user) throw new NotFoundException('Share User not found');
    return this.safeUser(user);
  }

  async setBlocked(uuid: string, blocked: boolean) {
    const user = await this.userModel.findOne({ where: { uuid } });
    if (!user) throw new NotFoundException('Share User not found');
    await user.update({ status: blocked ? ShareUserStatus.BLOCKED : ShareUserStatus.ACTIVE, refreshTokenHash: blocked ? null : user.refreshTokenHash });
    return this.safeUser(user);
  }

  async adminCreateUser(dto: RegisterShareUserDto) {
    const existing = await this.userModel.findOne({ where: { [Op.or]: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])] } });
    if (existing) throw new ConflictException('A Share User with this email or phone already exists');
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: ShareUserRole.OWNER,
      status: ShareUserStatus.ACTIVE,
      emailVerified: true,
    } as any);
    return { message: 'Share User created successfully.', user: this.safeUser(user) };
  }

  async adminUpdateUser(uuid: string, data: { name?: string; phone?: string; password?: string }) {
    const user = await this.userModel.findOne({ where: { uuid } });
    if (!user) throw new NotFoundException('Share User not found');
    const updates: Record<string, unknown> = {};
    if (data.name) updates.name = data.name;
    if (data.phone !== undefined) updates.phone = data.phone || null;
    if (data.password) updates.passwordHash = await argon2.hash(data.password);
    await user.update(updates);
    return this.safeUser(user);
  }
}
