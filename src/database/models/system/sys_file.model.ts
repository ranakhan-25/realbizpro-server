import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  SysFileModelAttributes,
  SysFileModelCreationAttributes,
} from '../../types/sysfilemodel.types';
import { SysUser } from './sys_user.model';

export enum CompressionType {
  NONE = 'none',
  GZIP = 'gzip',
  SHARP = 'sharp',
  ARCHIVE = 'archive',
}

export enum FileStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Table({
  tableName: 'sys_files',
  timestamps: true,
})
export class SysFileModel extends BaseModel<
  SysFileModelAttributes,
  SysFileModelCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  originalName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileName!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  filePath!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mimeType!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  originalSize!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  compressedSize?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: CompressionType.NONE,
  })
  compressionType: CompressionType;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  compressionRatio?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bucketName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: FileStatus.PROCESSING,
  })
  status!: FileStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  checksum?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  thumbnailPath?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  thumbnailPathTest?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  uploadedBy!: number;

  @BelongsTo(() => SysUser, 'uploadedBy')
  user!: SysUser;
}
