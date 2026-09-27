import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysFileModel } from '../../../database/models/system/sys_file.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { S3minioController } from './s3minio.controller';
import { S3minioService } from './s3minio.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysFileModel,
      SysUser,
    ]),
  ],
  controllers: [S3minioController],
  providers: [S3minioService],
  exports: [S3minioService],
})
export class S3minioModule {}
