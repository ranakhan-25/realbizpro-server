import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorHandlerHelper } from '../../../common/helper/errorMessage.helper';
import {
  FileStatus,
  SysFileModel,
} from '../../../database/models/system/sys_file.model';
import { CreateS3minioDto } from './dto/create-s3minio.dto';

@Injectable()
export class S3minioService implements OnModuleInit {
  private readonly logger = new Logger(
    S3minioService.name,
  );
  private s3Client: S3Client;
  private readonly defaultBucket: string;
  private isConnected = false;
  private bucketName: string = 'uploads';

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(SysFileModel)
    private readonly fileModel: typeof SysFileModel,
  ) {
    this.defaultBucket =
      this.configService.get(
        'MINIO_DEFAULT_BUCKET',
      ) || 'uploads';
    this.bucketName = this.defaultBucket;
    try {
      this.initializeS3Client();
    } catch (error) {
      this.logger.warn(
        '⚠️ S3/MinIO configuration incomplete, service disabled',
      );
    }
  }

  async onModuleInit() {
    await this.ensureConnected();
  }

  private initializeS3Client(): void {
    const endpoint = this.configService.get(
      'MINIO_ENDPOINT',
    );
    const port =
      this.configService.get('MINIO_PORT');
    const accessKey = this.configService.get(
      'MINIO_ACCESS_KEY',
    );
    const secretKey = this.configService.get(
      'MINIO_SECRET_KEY',
    );
    const useSSL =
      this.configService.get('MINIO_USE_SSL') ===
      'true';

    if (!endpoint || !accessKey || !secretKey) {
      this.logger.warn(
        '⚠️ MinIO configuration missing. Set MINIO_ENDPOINT, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY',
      );
      return;
    }

    const endpointUrl = `${useSSL ? 'https' : 'http'}://${endpoint}${port ? `:${port}` : ''}`;

    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: endpointUrl,
      forcePathStyle: true,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      requestHandler: {
        requestTimeout: 5000,
        connectionTimeout: 5000,
      },
    });
    this.logger.log(
      `🔗 S3Client initialized with endpoint: ${endpointUrl}`,
    );
  }

  private async ensureConnected(): Promise<boolean> {
    if (this.isConnected && this.s3Client) {
      return true;
    }

    if (!this.s3Client) {
      this.initializeS3Client();
    }

    if (!this.s3Client) {
      return false;
    }

    try {
      await this.initializeBuckets();
      this.isConnected = true;
      this.logger.log(
        '✅ S3/MinIO buckets initialized successfully',
      );
      return true;
    } catch (error: any) {
      this.logger.warn(
        `⚠️ S3/MinIO connection failed: ${error.message}`,
      );
      this.isConnected = false;
      return false;
    }
  }

  private async initializeBuckets(): Promise<void> {
    const buckets = [
      this.defaultBucket,
      'thumbnails',
      'archives',
    ];
    for (const bucketName of buckets) {
      try {
        await this.s3Client.send(
          new HeadBucketCommand({
            Bucket: bucketName,
          }),
        );
        this.logger.log(
          `✅ Bucket '${bucketName}' exists`,
        );
      } catch (error: any) {
        if (
          error.name === 'NotFound' ||
          error.$metadata?.httpStatusCode === 404
        ) {
          this.logger.log(
            `Bucket '${bucketName}' not found. Creating...`,
          );
          await this.s3Client.send(
            new CreateBucketCommand({
              Bucket: bucketName,
            }),
          );
          this.logger.log(
            `🆕 Created bucket '${bucketName}'`,
          );
        } else {
          throw error;
        }
      }
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    createDto?: CreateS3minioDto,
    userId?: number,
  ): Promise<SysFileModel> {
    try {
      const connected =
        await this.ensureConnected();

      // Clean up DTO values
      const dto = createDto || {};

      // Generate unique filename with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random()
        .toString(36)
        .substring(2, 15);
      const fileExtension =
        file.originalname.split('.').pop() ||
        'jpg';

      const originalNameWithoutExt =
        file.originalname.substring(
          0,
          file.originalname.lastIndexOf('.'),
        ) || file.originalname;

      const fileStoreName = dto.fileName
        ? dto.fileName
        : originalNameWithoutExt;

      const sanitizedCustomName = fileStoreName
        ?.trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove special characters
        .toLowerCase();
      const generatedFileName = `${sanitizedCustomName}-${timestamp}-${randomString}.${fileExtension}`;

      const fileName = generatedFileName;
      const folder = dto.pathFolder
        ?.trim()
        .toLowerCase();
      const key = folder
        ? `${folder}/${fileName}`
        : fileName;

      if (connected && this.s3Client) {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          Metadata: {
            originalName: file.originalname,
            uploadedBy:
              userId?.toString() || 'anonymous',
          },
        });
        await this.s3Client.send(command);
        this.logger.log(
          `📁 File uploaded to MinIO: ${this.bucketName}/${key}`,
        );
      } else {
        // Fallback: save to local disk
        const localUploadDir = path.join(
          process.cwd(),
          'uploads',
          folder || '',
        );
        if (!fs.existsSync(localUploadDir)) {
          fs.mkdirSync(localUploadDir, {
            recursive: true,
          });
        }
        const localFilePath = path.join(
          localUploadDir,
          fileName,
        );
        fs.writeFileSync(
          localFilePath,
          file.buffer,
        );
        this.logger.log(
          `💾 File saved locally: ${localFilePath}`,
        );
      }

      const fileRecord =
        await this.fileModel.create({
          fileName: fileName,
          originalName: file.originalname,
          mimeType: file.mimetype,
          originalSize: file.size,
          bucketName: this.bucketName,
          filePath: key,
          uploadedBy: userId,
          status: FileStatus.COMPLETED,
        });

      return fileRecord;
    } catch (error) {
      this.logger.error('Upload failed:', error);
      ErrorHandlerHelper.handleError(error);
    }
  }

  async generatePresignedDownloadUrl(
    key: string,
  ): Promise<{ presignedUrl: string }> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const presignedUrl = await getSignedUrl(
        this.s3Client,
        command,
        {
          expiresIn: 3600,
        },
      );
      return { presignedUrl };
    } catch (error) {
      this.logger.error(
        'Failed to generate presigned URL:',
        error,
      );
      ErrorHandlerHelper.handleError(error);
    }
  }

  async deleteFile(
    key: string,
    bucketName?: string,
  ): Promise<{ message: string }> {
    const targetBucket =
      bucketName || this.bucketName;
    const command = new DeleteObjectCommand({
      Bucket: targetBucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(
        `🗑️ File deleted from ${targetBucket}: ${key}`,
      );
      return {
        message: `File ${key} deleted successfully`,
      };
    } catch (error) {
      this.logger.error('Delete failed:', error);
      ErrorHandlerHelper.handleError(error);
    }
  }
}
