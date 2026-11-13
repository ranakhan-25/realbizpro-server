import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LandOwnerService } from './land-owner.service';
import { CreateLandOwnerDto } from './dto/create-land-owner.dto';
import { UpdateLandOwnerDto } from './dto/update-land-owner.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/auth.decorators';

@ApiTags('LAMS - Land Owners')
@ApiBearerAuth()
@Controller('lams/land-owners')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LandOwnerController {
  constructor(private readonly service: LandOwnerService) {}

  @Post()
  @Permissions('lams_land_owners.create')
  @ApiOperation({ summary: 'Create a new landowner profile' })
  async create(@Body() createDto: CreateLandOwnerDto, @CurrentUser() user: any) {
    return this.service.create(createDto, user);
  }

  @Get()
  @Permissions('lams_land_owners.read')
  @ApiOperation({ summary: 'Get all landowners with filters and search' })
  async findAll(
    @CurrentUser() user: any,
    @Query('org_id') queryOrgId?: string,
    @Query('lead_id') leadId?: string,
    @Query('has_nid') hasNid?: string,
    @Query('search') search?: string,
  ) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || queryOrgId;
    return this.service.findAll({
      org_id: orgId,
      lead_id: leadId,
      has_nid: hasNid === 'true',
      search: search,
    });
  }

  @Get(':uuid')
  @Permissions('lams_land_owners.read')
  @ApiOperation({ summary: 'Get a landowner by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the landowner' })
  async findOne(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    return this.service.findOne(uuid, orgId);
  }

  @Put(':uuid')
  @Permissions('lams_land_owners.update')
  @ApiOperation({ summary: 'Update a landowner by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the landowner' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateLandOwnerDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(uuid, updateDto, user);
  }

  @Delete(':uuid')
  @Permissions('lams_land_owners.delete')
  @ApiOperation({ summary: 'Delete a landowner by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the landowner' })
  async remove(@Param('uuid') uuid: string, @CurrentUser() user: any) {
    return this.service.remove(uuid, user);
  }
}
