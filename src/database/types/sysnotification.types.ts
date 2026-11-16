// Auto-generated types for SysNotification
// Source: src\database\models\system\sys_notification.model.ts

import type { SysUser } from '../models/system/sys_user.model';

export interface SysNotificationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  title: string;
  message: string;
  data?: Record<string, any> | null;
  userId: number;
  isRead: boolean;
  readAt?: Date | null;

  // Relations
  user: SysUser;
}

export interface SysNotificationCreationAttributes {
  title: string;
  message: string;
  data?: Record<string, any> | null;
  userId: number;
  isRead?: boolean; // Has default value
  readAt?: Date | null;
}

export type SysNotificationUpdateAttributes = Partial<SysNotificationCreationAttributes>;

// Helper type for including relations
export interface SysNotificationWithRelations extends SysNotificationAttributes {
  user: SysUser;
}
