import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import {
  AuthHeader,
  CurrentUserId,
} from '@/common/decorators/auth.decorators';
import { Public } from '@/common/decorators/public.decorator';

import { CreateHrmMobileAuthFaceDto } from './dto/create-hrm-mobile-auth-face.dto';
import { VerifyFaceAttendanceDto } from './dto/verify-face-attendance.dto';
import { FACE_AUTH_MAX_FILE_SIZE } from './face-auth.constants';
import { HrmMobileAuthFaceService } from './hrm-mobile-auth-face.service';

@ApiTags('MOBILE | Face Authentication')
@Controller()
export class HrmMobileAuthFaceController {
  constructor(
    private readonly service: HrmMobileAuthFaceService,
  ) {}

  @Post('face/register')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: FACE_AUTH_MAX_FILE_SIZE,
        files: 1,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Register employee face using employeeCode and one in-memory file.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['employeeCode', 'file'],
      properties: {
        employeeCode: {
          type: 'string',
          example: 'EBR-107',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Face registration completed successfully.',
  })
  async registerFace(
    @Body() dto: CreateHrmMobileAuthFaceDto,
    @UploadedFile() file: Express.Multer.File,
    @AuthHeader() authorization?: string,
    @CurrentUserId() userId?: number,
  ) {
    if (!file) {
      throw new BadRequestException(
        'At least 1 image is required.',
      );
    }

    return this.service.create(
      dto,
      file,
      { authorization },
      userId,
    );
  }

  @Post('attendance/public/verify-face')
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: FACE_AUTH_MAX_FILE_SIZE,
        files: 1,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Public attendance verification using one in-memory file.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['employeeCode', 'file'],
      properties: {
        employeeCode: {
          type: 'string',
          example: 'EBR-107',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
        latitude: {
          type: 'string',
          example: '23.810331',
        },
        longitude: {
          type: 'string',
          example: '90.412521',
        },
        locationName: {
          type: 'string',
          example: 'Easy Soft Head Office',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Public attendance verification completed successfully.',
  })
  async verifyPublicAttendance(
    @Body() dto: VerifyFaceAttendanceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Attendance file is required.',
      );
    }

    return this.service.verifyAttendance(
      dto,
      file,
    );
  }
}
