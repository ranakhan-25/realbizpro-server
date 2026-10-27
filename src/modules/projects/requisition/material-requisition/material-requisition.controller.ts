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
} from '@nestjs/common';
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
export class MaterialRequisitionController {
  constructor(
    private readonly requisitionService: MaterialRequisitionService,
  ) {}

  @Post()
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
  findAll(
    @Query() query: QueryMaterialRequisitionDto,
  ) {
    return this.requisitionService.findAll(query);
  }

  @Get(':uuid')
  findOne(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
  ) {
    return this.requisitionService.findOne(uuid);
  }

  @Patch(':uuid')
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
