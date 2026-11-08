import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateSubcontractPackageDto,
  QuerySubcontractPackageDto,
  UpdateSubcontractPackageDto,
} from './dto/subcontract-package.dto';
import { ProcurementSubcontractPackageService } from './subcontract-package.service';

@ApiTags('Procurement | Subcontract Packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/subcontract-packages')
export class ProcurementSubcontractPackageController {
  constructor(
    private readonly service: ProcurementSubcontractPackageService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a subcontract package',
  })
  create(
    @Body() dto: CreateSubcontractPackageDto,
  ) {
    return this.service.create(dto);
  }
  @Get()
  @ApiOperation({
    summary:
      'List subcontract packages with quick search and status filter',
  })
  findAll(
    @Query() query: QuerySubcontractPackageDto,
  ) {
    return this.service.findAll(query);
  }
  @Get('dropdowns')
  @ApiOperation({
    summary:
      'Get active subcontract packages for dropdowns',
  })
  dropdowns() {
    return this.service.dropdowns();
  }
  @Get(':uuid')
  @ApiOperation({
    summary: 'Get subcontract package details',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update subcontract package',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSubcontractPackageDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete subcontract package',
  })
  remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore deleted subcontract package',
  })
  restore(@Param('uuid') uuid: string) {
    return this.service.restore(uuid);
  }
}
