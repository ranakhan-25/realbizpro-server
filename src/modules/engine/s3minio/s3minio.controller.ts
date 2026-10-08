import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUserId } from '../../../common/decorators/auth.decorators';
import { Public } from '../../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ErrorHandlerHelper } from '../../../common/helper/errorMessage.helper';
import { SysFileModel } from '../../../database/models/system/sys_file.model';
import { CreateS3minioDto } from './dto/create-s3minio.dto';
import { S3minioService } from './s3minio.service';

@ApiTags('file-upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('files')
export class S3minioController {
  constructor(
    private readonly s3minioService: S3minioService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Upload a file directly to the server',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        pathFolder: {
          type: 'string',
        },
        fileName: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateS3minioDto,
    @CurrentUserId() userId: number,
  ): Promise<SysFileModel> {
    if (!file) {
      throw new BadRequestException(
        'No file provided',
      );
    }
    return this.s3minioService.uploadFile(
      file,
      createDto,
      userId,
    );
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({
    name: 'key',
    description: 'File key',
  })
  async deleteFile(
    @Param('key') key: string,
  ): Promise<{ message: string }> {
    await this.s3minioService.deleteFile(key);
    return {
      message: 'File deleted successfully',
    };
  }

  @Public()
  @Get('content/:key')
  @ApiOperation({
    summary: 'Serve file content directly',
  })
  @ApiParam({
    name: 'key',
    description: 'File key',
  })
  @ApiResponse({
    status: 200,
    description: 'File content served',
  })
  @Header(
    'Content-Type',
    'application/octet-stream',
  )
  async serveFile(
    @Param('key') key: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const downloadUrl =
        await this.s3minioService.generatePresignedDownloadUrl(
          key,
        );

      // Fetch the file and stream it
      const response = await fetch(
        downloadUrl.presignedUrl,
      );
      const buffer = await response.arrayBuffer();

      res.setHeader(
        'Content-Type',
        response.headers.get('content-type') ||
          'application/octet-stream',
      );
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${key.split('/').pop()}"`,
      );
      res.send(Buffer.from(buffer));
    } catch (error) {
      ErrorHandlerHelper.handleError(error);
    }
  }
}
