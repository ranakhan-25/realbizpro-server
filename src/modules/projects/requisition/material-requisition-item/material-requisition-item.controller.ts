/* eslint-disable prettier/prettier */
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { MaterialRequisitionItemService } from './material-requisition-item.service';
import { CreateMaterialRequisitionItemDto } from './dto/create-material-requisition-item.dto';
import { UpdateMaterialRequisitionItemDto } from './dto/update-material-requisition-item.dto';
import { QueryMaterialRequisitionItemDto } from './dto/query-material-requisition-item.dto';

@ApiTags('Project | Requisition | Material Requisition Item')
@ApiBearerAuth()
@Controller('material-requisition-item')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialRequisitionItemController {
  constructor(
    private readonly itemService: MaterialRequisitionItemService,
  ) {}

  @Post()
  @Permissions('create_material_requisition_item')
  create(
    @Body() dto: CreateMaterialRequisitionItemDto,
    @Req() req: any,
  ) {
    return this.itemService.create(
      dto,
      req.user?.uuid,
    );
  }

  @Get()
  @Permissions('view_material_requisition_items')
  findAll(
    @Query()
    query: QueryMaterialRequisitionItemDto,
  ) {
    return this.itemService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_material_requisition_item')
  findOne(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
  ) {
    return this.itemService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_material_requisition_item')
  update(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @Body() dto: UpdateMaterialRequisitionItemDto,
    @Req() req: any,
  ) {
    return this.itemService.update(
      uuid,
      dto,
      req.user?.uuid,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_material_requisition_item')
  remove(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @Req() req: any,
  ) {
    return this.itemService.remove(
      uuid,
      req.user?.uuid,
    );
  }
}
