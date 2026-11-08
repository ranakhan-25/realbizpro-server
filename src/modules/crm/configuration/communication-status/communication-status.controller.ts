import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommunicationStatusDto } from './dto/create-communication-status.dto';
import { QueryCommunicationStatusDto } from './dto/query-communication-status.dto';
import { UpdateCommunicationStatusDto } from './dto/update-communication-status.dto';
import { CommunicationStatusService } from './communication-status.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/auth.decorators';

@ApiTags(
  'CRM | configuration | Communication Status',
)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller(
  'crm/configuration/communication-status',
)
export class CommunicationStatusController {
  constructor(
    private readonly service: CommunicationStatusService,
  ) {}

  @Post()
  @Permissions('create_crm_communication_status')
  @ApiOperation({
    summary: 'Create communication status',
  })
  create(
    @Body() dto: CreateCommunicationStatusDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(
      dto,
      userId,
      currentUser,
    );
  }

  @Get()
  @Permissions('list_crm_communication_status')
  @ApiOperation({
    summary:
      'List communication statuses with search, filters and pagination',
  })
  findAll(
    @Query() query: QueryCommunicationStatusDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(
      query,
      currentUser,
    );
  }

  @Get('dropdown')
  @Permissions('read_crm_communication_status')
  @ApiOperation({
    summary:
      'Get active communication statuses for dropdown',
  })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get('lead-stage-dropdown')
  @Permissions('read_crm_communication_status')
  @ApiOperation({
    summary:
      'Get active lead stages for communication status dropdown',
  })
  leadStageDropdown(
    @CurrentUser() currentUser: any,
  ) {
    return this.service.leadStageDropdown(
      currentUser,
    );
  }

  @Get(':uuid')
  @Permissions('read_crm_communication_status')
  @ApiOperation({
    summary: 'Get communication status details',
  })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(
      uuid,
      currentUser,
    );
  }

  @Patch(':uuid')
  @Permissions('update_crm_communication_status')
  @ApiOperation({
    summary: 'Update communication status',
  })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateCommunicationStatusDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(
      uuid,
      dto,
      userId,
      currentUser,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_crm_communication_status')
  @ApiOperation({
    summary: 'Soft delete communication status',
  })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(
      uuid,
      userId,
      currentUser,
    );
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_communication_status')
  @ApiOperation({
    summary:
      'Restore soft-deleted communication status',
  })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(
      uuid,
      userId,
      currentUser,
    );
  }
}
