import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import {
  Paginate,
  PaginateParams,
} from '../../../common/decorators/paginate.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { PaginateDto } from '../../../common/dto/paginate.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { PaginateHelper } from '../../../common/helper/paginate.helper';
import { CreateFeatureDto } from './dto/create.dto';
import { UpdateFeatureDto } from './dto/update.dto';
import { FeaturesService } from './feature.service';

@ApiTags('System | Features')
@Controller('features')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class FeaturesController {
  constructor(
    private readonly featuresService: FeaturesService,
  ) {}

  @Post()
  @Permissions('create_feature')
  @ApiOperation({
    summary: 'Create a new feature',
  })
  @ApiResponse({
    status: 201,
    description: 'Feature created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Feature name already exists',
  })
  async create(
    @Body() createFeatureDto: CreateFeatureDto,
  ) {
    return this.featuresService.create(
      createFeatureDto,
    );
  }

  @Get('tree-permissions')
  @Permissions('view_features')
  @ApiOperation({
    summary:
      'Get all features in tree structure with permissions',
  })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    description:
      'Optional module ID to filter features',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Features tree retrieved successfully',
  })
  async findAllTreeWithPermissions(
    @Query('moduleId') moduleId?: string,
  ) {
    const moduleIdNumber = moduleId
      ? +moduleId
      : undefined;
    return this.featuresService.findAllTreeWithPermissions(
      moduleIdNumber,
    );
  }

  @Get('simple')
  @Permissions('view_features')
  @ApiOperation({
    summary: 'Get all features (simple list)',
  })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    description:
      'Optional module ID to filter features',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Features retrieved successfully',
  })
  async findAllSimple(
    @Query('moduleId') moduleId?: string,
  ) {
    const moduleIdNumber = moduleId
      ? +moduleId
      : undefined;
    return this.featuresService.findAll(
      moduleIdNumber,
    );
  }

  @Get()
  @Permissions('view_features')
  @ApiOperation({
    summary: 'Get all features with pagination',
  })
  @ApiResponse({
    status: 200,
    description:
      'Features retrieved successfully',
  })
  @ApiQuery({ type: PaginateDto })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    description:
      'Optional module ID to filter features',
    type: Number,
  })
  async findAll(
    @Paginate({ limit: 20, maxLimit: 500 })
    params: PaginateParams,
    @Query('moduleId') moduleId?: string,
  ) {
    const moduleIdNumber = moduleId
      ? +moduleId
      : undefined;
    const [features, total] =
      await this.featuresService.findAndCount({
        ...params,
        moduleId: moduleIdNumber,
      });
    return PaginateHelper.response(
      features,
      total,
      params,
    );
  }

  @Get('dropdown')
  @ApiOperation({
    summary: 'Get features for dropdown',
  })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    description:
      'Optional module ID to filter features',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Features for dropdown retrieved successfully',
  })
  async getFeatureDropdown(
    @Query('moduleId') moduleId?: string,
  ) {
    const moduleIdNumber = moduleId
      ? +moduleId
      : undefined;
    return this.featuresService.getFeatureDropdown(
      moduleIdNumber,
    );
  }

  @Get(':id')
  @Permissions('view_feature')
  @ApiOperation({ summary: 'Get feature by ID' })
  @ApiParam({
    name: 'id',
    description: 'Feature ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Feature found',
  })
  @ApiResponse({
    status: 404,
    description: 'Feature not found',
  })
  async findOne(@Param('id') id: string) {
    return this.featuresService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('update_feature')
  @ApiOperation({ summary: 'Update feature' })
  @ApiParam({
    name: 'id',
    description: 'Feature ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Feature updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Feature not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ) {
    return this.featuresService.update(
      +id,
      updateFeatureDto,
    );
  }

  @Delete(':id')
  @Permissions('delete_feature')
  @ApiOperation({ summary: 'Delete feature' })
  @ApiParam({
    name: 'id',
    description: 'Feature ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Feature deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Feature not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Cannot delete - permissions linked',
  })
  async remove(@Param('id') id: string) {
    return this.featuresService.remove(+id);
  }
}
