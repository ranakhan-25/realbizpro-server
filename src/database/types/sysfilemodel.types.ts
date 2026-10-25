// Auto-generated types for SysFileModel
// Source: src/database/models/system/sys_file.model.ts

import { CompressionType } from '../models/system/sys_file.model';
import { FileStatus } from '../models/system/sys_file.model';

import type { SysUser } from '../models/system/sys_user.model';

export interface SysFileModelAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  originalName?: string | null;
  fileName: string;
  filePath: string | null;
  mimeType: string;
  originalSize: number;
  compressedSize?: number | null;
  compressionType: CompressionType;
  compressionRatio?: number | null;
  bucketName: string;
  status: FileStatus;
  checksum?: string | null;
  thumbnailPath?: string | null;
  thumbnailPathTest?: string | null;
  metadata?: Record<string, any> | null;
  uploadedBy: number | null;

  // Relations
  user: SysUser;
}

export interface SysFileModelCreationAttributes {
  originalName?: string | null;
  fileName: string;
  filePath?: string | null; // Nullable
  mimeType: string;
  originalSize: number;
  compressedSize?: number | null;
  compressionType?: CompressionType; // Has default value
  compressionRatio?: number | null;
  bucketName: string;
  status?: FileStatus; // Has default value
  checksum?: string | null;
  thumbnailPath?: string | null;
  thumbnailPathTest?: string | null;
  metadata?: Record<string, any> | null;
  uploadedBy?: number | null; // Nullable
}

export type SysFileModelUpdateAttributes = Partial<SysFileModelCreationAttributes>;

// Helper type for including relations
export interface SysFileModelWithRelations extends SysFileModelAttributes {
  user: SysUser;
}
