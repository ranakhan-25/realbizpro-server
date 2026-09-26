// src/modules/system/company.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUserId } from '../../../common/decorators/auth.decorators';
import {
  Paginate,
  PaginateParams,
} from '../../../common/decorators/paginate.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { PaginateDto } from '../../../common/dto/paginate.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { PaginateHelper } from '../../../common/helper/paginate.helper';

import { CompanyResponseDto } from './dto/company-response.dto';
import { CreateCompanyDto } from './dto/create-sys-company.dto';
import { UpdateCompanyDto } from './dto/update-sys-company.dto';
import { CompanyService } from './sys-company.service';

@ApiTags('System | Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) {}

  @Post()
  @Permissions('create_company')
  @ApiOperation({
    summary: 'Create a new company',
  })
  @ApiResponse({
    status: 201,
    description: 'Company created',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Company already exists',
  })
  async create(
    @Body() createDto: CreateCompanyDto,
    @CurrentUserId() userId: number,
  ) {
    return this.companyService.create(
      createDto,
      userId,
    );
  }

  @Get()
  @Permissions('view_companies')
  @ApiOperation({
    summary:
      'Get all companies with optional pagination',
  })
  @ApiQuery({
    type: PaginateDto,
    required: false,
  })
  async findAll(
    @Paginate({ limit: 20, maxLimit: 50 })
    params: PaginateParams,
  ) {
    const [rows, total] =
      (await this.companyService.findAndCount?.(
        params,
      )) ?? [
        await this.companyService.findAll(),
        0,
      ];
    return PaginateHelper.response(
      rows,
      total,
      params,
    );
  }

  @Get(':id')
  @Permissions('view_company')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Company retrieved',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async findOne(@Param('id') id: number) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update_company')
  @ApiOperation({ summary: 'Update company' })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Company updated',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete_company')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete company',
  })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Company deleted',
  })
  async remove(
    @Param('id') id: number,
    @CurrentUserId() userId: number,
  ) {
    return this.companyService.softDelete(
      id,
      userId,
    );
  }
}
