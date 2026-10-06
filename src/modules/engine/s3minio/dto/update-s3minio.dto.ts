import { PartialType } from '@nestjs/swagger';
import { CreateS3minioDto } from './create-s3minio.dto';

export class UpdateS3minioDto extends PartialType(
  CreateS3minioDto,
) {}
