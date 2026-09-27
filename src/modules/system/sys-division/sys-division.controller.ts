import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PaginateHelper } from '@/common/helper/paginate.helper';
import { DivisionService } from './sys-division.service';
import { QueryDivisionDto } from './dto/query-division.dto';

@ApiTags('System | Division')
@ApiBearerAuth()
@Controller('divisions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DivisionController {
  constructor(
    private readonly divisionService: DivisionService,
  ) {}

  // =========================
  // GET LIST (Paginated)
  // =========================
  @Get()
  @ApiOperation({
    summary:
      'Get divisions with district, upazila & union (ID / Name filters)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Divisions retrieved successfully',
  })
  async findAll(
    @Query() query: QueryDivisionDto,
  ) {
    const [rows, total] =
      await this.divisionService.findAndCount(
        query,
      );

    return PaginateHelper.response(rows, total, {
      page: query.page,
      limit: query.limit,
    });
  }

  // =========================
  // GET ONE (by UUID)
  // =========================
  @Get(':uuid')
  @ApiOperation({
    summary:
      'Get single division by UUID with districts, upazilas & unions',
  })
  @ApiParam({
    name: 'uuid',
    description: 'Division UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description:
      'Division retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Division not found',
  })
  async findOne(@Param('uuid') uuid: string) {
    return this.divisionService.findOneByUuid(
      uuid,
    );
  }
}
