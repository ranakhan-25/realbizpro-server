/* eslint-disable prettier/prettier */

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ProjectBudgetService } from './project_budget.service';
import { CreateProjectBudgetDto } from './dto/create-project_budget.dto';
import { QueryProjectBudgetDto } from './dto/query-project_budget.dto';
import { UpdateProjectBudgetDto } from './dto/update-project_budget.dto';



@Controller('project-budgets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectBudgetController {
  constructor(private readonly budgetService: ProjectBudgetService) {}

  @Post()
  @Permissions('create_project_budget')
  create(@Body() createDto: CreateProjectBudgetDto) {
    return this.budgetService.create(createDto);
  }

  @Get()
  @Permissions('view_project_budgets')
  findAll(@Query() query: QueryProjectBudgetDto) {
    return this.budgetService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  @Permissions('view_project_budget_summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.budgetService.getSummary(projectUuid);
  }

  @Get(':uuid')
  @Permissions('view_project_budget')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.budgetService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_project_budget')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectBudgetDto
  ) {
    return this.budgetService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_budget')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.budgetService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_project_budget')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.budgetService.restore(uuid);
  }
}