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
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('System | Subscription Plans')
@Controller('system/plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({
    summary: 'List all subscription plans',
    description: 'Retrieve all available pricing plans with user/project quotas, prices, and features.',
  })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'archived'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of plans returned successfully',
    type: [PlanResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PlanResponseDto[]> {
    return this.plansService.findAll({ status, search });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single subscription plan by ID or UUID',
  })
  @ApiParam({ name: 'id', description: 'Numeric ID or UUID string of the plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan retrieved successfully',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found',
  })
  async findOne(@Param('id') id: string): Promise<PlanResponseDto> {
    return this.plansService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new subscription plan package',
    description: 'Super Admin registers a new tier with pricing, trial days, and quotas.',
  })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Plan code already exists',
  })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.plansService.create(createPlanDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing subscription plan',
  })
  @ApiParam({ name: 'id', description: 'Numeric ID or UUID string of the plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Archive / soft-delete a subscription plan',
  })
  @ApiParam({ name: 'id', description: 'Numeric ID or UUID string of the plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan archived successfully',
  })
  async remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
