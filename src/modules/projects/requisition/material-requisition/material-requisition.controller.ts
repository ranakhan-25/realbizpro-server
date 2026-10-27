/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
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
import { MaterialRequisitionService } from './material-requisition.service';
import { CreateMaterialRequisitionDto } from './dto/create-material-requisition.dto';
import { UpdateMaterialRequisitionDto } from './dto/update-material-requisition.dto';
import { QueryMaterialRequisitionDto } from './dto/query-material-requisition.dto';

@ApiTags('Project | Requisition | Material Requisition')
@ApiBearerAuth()
@Controller('material-requisition')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialRequisitionController {
  constructor(
    private readonly requisitionService: MaterialRequisitionService,
  ) {}

  @Post()
  @Permissions('create_material_requisition')
  create(
    @Body() dto: CreateMaterialRequisitionDto,
    @Req() req: any,
  ) {
    return this.requisitionService.create(
      dto,
      req.user?.uuid,
    );
  }

  @Get()
  @Permissions('view_material_requisitions')
  findAll(
    @Query() query: QueryMaterialRequisitionDto,
  ) {
    return this.requisitionService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_material_requisition')
  findOne(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
  ) {
    return this.requisitionService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_material_requisition')
  update(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @Body() dto: UpdateMaterialRequisitionDto,
    @Req() req: any,
  ) {
    return this.requisitionService.update(
      uuid,
      dto,
      req.user?.uuid,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_material_requisition')
  remove(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @Req() req: any,
  ) {
    return this.requisitionService.remove(
      uuid,
      req.user?.uuid,
    );
  }
}
