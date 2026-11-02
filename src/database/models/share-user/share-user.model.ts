import type { ShareUserAttributes, ShareUserCreationAttributes } from '../../types/shareuser.types';

import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

export enum ShareUserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

export enum ShareUserRole {
  OWNER = 'project-owner',
  SUPER_ADMIN = 'super-admin',
}

@Table({
  tableName: 'share_users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ShareUser extends BaseModel<ShareUserAttributes, ShareUserCreationAttributes> {
  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(20), allowNull: true, unique: true })
  declare phone?: string;

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'password_hash' })
  declare passwordHash: string;

  @Column({
    type: DataType.ENUM(...Object.values(ShareUserRole)),
    allowNull: false,
    defaultValue: ShareUserRole.OWNER,
  })
  declare role: ShareUserRole;

  @Column({
    type: DataType.ENUM(...Object.values(ShareUserStatus)),
    allowNull: false,
    defaultValue: ShareUserStatus.PENDING,
  })
  declare status: ShareUserStatus;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare emailVerified: boolean;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'email_verification_token_hash' })
  declare emailVerificationTokenHash?: string;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'password_reset_token_hash' })
  declare passwordResetTokenHash?: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'password_reset_expires_at' })
  declare passwordResetExpiresAt?: Date;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'refresh_token_hash' })
  declare refreshTokenHash?: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'last_login_at' })
  declare lastLoginAt?: Date;
}
