import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CurrentUser,
  CurrentUserId,
} from '@/common/decorators/auth.decorators';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtMobileAuthGuard } from '@/common/guards/jwt-mobile-auth.guard';
import { PaginateHelper } from '@/common/helper/paginate.helper';
import { MobileUserService } from './mobile-user.service';
import { QueryMobileUserDto } from './dto/query-mobile-user.dto';
import { UpdateMobileUserStatusDto } from './dto/update-mobile-user-status.dto';
import { MobileUserPasswordChangeDto } from './dto/mobile-user-password-change.dto';

@ApiTags('HRMS | Mobile User')
@Controller('mobile-user')
export class MobileUserController {
  constructor(
    private readonly service: MobileUserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Permissions('hrm_mobile_user_view')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all mobile users',
  })
  @ApiResponse({
    status: 200,
    description:
      'Mobile users retrieved successfully',
  })
  async findAll(
    @Query() query: QueryMobileUserDto,
  ) {
    const [items, total] =
      await this.service.findAndCount(query);

    return PaginateHelper.response(items, total, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  @Permissions('hrm_mobile_user_update')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update mobile user face/email verification and status by uuid',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Mobile auth user uuid',
    example:
      'c1b2d3e4-5678-90ab-cdef-1234567890ab',
  })
  @ApiResponse({
    status: 200,
    description:
      'Mobile user updated successfully',
  })
  updateStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateMobileUserStatusDto,
    @CurrentUserId() currentUserId?: number,
  ) {
    return this.service.updateStatus(
      uuid,
      dto,
      currentUserId,
    );
  }

  @Post('password/change')
  @UseGuards(JwtMobileAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Change authenticated mobile user password',
  })
  @ApiBody({
    type: MobileUserPasswordChangeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  changePassword(
    @Body() dto: MobileUserPasswordChangeDto,
    @CurrentUser() user: any,
  ) {
    return this.service.changePassword(
      user?.id,
      dto,
    );
  }
}
