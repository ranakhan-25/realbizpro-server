import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RequisitionService } from './material-requisition.service';
import { CreateMaterialRequisitionDto } from './dto/create-material-requisition.dto';
import { UpdateMaterialRequisitionDto } from './dto/update-material-requisition.dto';
import { QueryRequisitionDto } from './dto/query-material-requisition.dto';

@Controller('material-requisition')
export class MaterialRequisitionController {
  constructor(
    private readonly materialRequisitionService: RequisitionService,
  ) {}

  @Post()
  create(
    @Body()
    createMaterialRequisitionDto: CreateMaterialRequisitionDto,
  ) {
    return this.materialRequisitionService.create(
      createMaterialRequisitionDto,
    );
  }

  @Get()
  findAll(@Query() query: QueryRequisitionDto) {
    return this.materialRequisitionService.findAll(
      query,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialRequisitionService.findOne(
      +id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateMaterialRequisitionDto: UpdateMaterialRequisitionDto,
  ) {
    return this.materialRequisitionService.update(
      +id,
      updateMaterialRequisitionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialRequisitionService.remove(
      +id,
    );
  }
}
