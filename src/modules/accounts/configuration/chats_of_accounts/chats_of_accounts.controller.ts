/* eslint-disable prettier/prettier */

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Put, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe,
  UseGuards
} from '@nestjs/common';
import { ChartOfAccountService } from './chats_of_accounts.service';
import { CreateChartOfAccountDto } from './dto/create-chats_of_account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chats_of_account.dto';
import { QueryChartOfAccountDto } from './dto/query-chats_of_account.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('Accounts | configuration | chart-of-accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('chart-of-accounts')
export class ChartOfAccountController {
  constructor(private readonly accountService: ChartOfAccountService) {}

  @Post()
  @Permissions('create_chart_of_account')
  @ApiOperation({ summary: 'Create chart of account' })
  create(
    @Body() dto: CreateChartOfAccountDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.accountService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_chart_of_account')
  @ApiOperation({ summary: 'List chart of accounts' })
  findAll(
    @Query() query: QueryChartOfAccountDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.accountService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_chart_of_account')
  @ApiOperation({ summary: 'Get chart of account by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.accountService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_chart_of_account')
  @ApiOperation({ summary: 'Update chart of account (PATCH)' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChartOfAccountDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.accountService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_chart_of_account')
  @ApiOperation({ summary: 'Update chart of account (PUT)' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateChartOfAccountDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.accountService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_chart_of_account')
  @ApiOperation({ summary: 'Delete chart of account' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.accountService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_chart_of_account')
  @ApiOperation({ summary: 'Restore chart of account' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.accountService.restore(uuid, userId, currentUser);
  }
}
