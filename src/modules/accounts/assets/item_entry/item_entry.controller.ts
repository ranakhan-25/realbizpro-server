import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ItemEntryService } from './item_entry.service';
import { CreateItemEntryDto } from './dto/create-item_entry.dto';
import { QueryItemEntryDto } from './dto/query-item_entry.dto';
import { UpdateItemEntryDto } from './dto/update-item_entry.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('Accounts | assets| item_entry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('item-entry')
export class ItemEntryController {
  constructor(private readonly itemEntryService: ItemEntryService) {}

  @Post()
  @Permissions('create_item_entry')
  @ApiOperation({ summary: 'Create item entry' })
  create(
    @Body() createItemEntryDto: CreateItemEntryDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.itemEntryService.create(createItemEntryDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_item_entry')
  @ApiOperation({ summary: 'List item entries' })
  findAll(
    @Query() query: QueryItemEntryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.itemEntryService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_item_entry')
  @ApiOperation({ summary: 'Get item entry by UUID' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.itemEntryService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_item_entry')
  @ApiOperation({ summary: 'Update item entry' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateItemEntryDto: UpdateItemEntryDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.itemEntryService.update(uuid, updateItemEntryDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_item_entry')
  @ApiOperation({ summary: 'Delete item entry' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.itemEntryService.remove(uuid, userId, currentUser);
  }
}
