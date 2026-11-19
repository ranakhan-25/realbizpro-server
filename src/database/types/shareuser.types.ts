// Auto-generated types for ShareUser
// Source: src/database/models/share-user/share-user.model.ts

import { ShareUserRole } from '../models/share-user/share-user.model';
import { ShareUserStatus } from '../models/share-user/share-user.model';

export interface ShareUserAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  role: ShareUserRole;
  status: ShareUserStatus;
  emailVerified: boolean;
  emailVerificationTokenHash?: string | null;
  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: Date | null;
  refreshTokenHash?: string | null;
  lastLoginAt?: Date | null;
}

export interface ShareUserCreationAttributes {
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  role?: ShareUserRole; // Has default value
  status?: ShareUserStatus; // Has default value
  emailVerified?: boolean; // Has default value
  emailVerificationTokenHash?: string | null;
  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: Date | null;
  refreshTokenHash?: string | null;
  lastLoginAt?: Date | null;
}

export type ShareUserUpdateAttributes = Partial<ShareUserCreationAttributes>;

// Helper type for including relations
export interface ShareUserWithRelations extends ShareUserAttributes {
  // No relations defined
}
