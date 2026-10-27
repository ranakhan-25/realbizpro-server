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
} from '@nestjs/common';
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
export class MaterialRequisitionItemController {
  constructor(
    private readonly itemService: MaterialRequisitionItemService,
  ) {}

  @Post()
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
  findAll(
    @Query()
    query: QueryMaterialRequisitionItemDto,
  ) {
    return this.itemService.findAll(query);
  }

  @Get(':uuid')
  findOne(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
  ) {
    return this.itemService.findOne(uuid);
  }

  @Patch(':uuid')
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
