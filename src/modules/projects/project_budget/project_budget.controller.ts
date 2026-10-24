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
  ParseUUIDPipe 
} from '@nestjs/common';
import { ProjectBudgetService } from './project_budget.service';
import { CreateProjectBudgetDto } from './dto/create-project_budget.dto';
import { QueryProjectBudgetDto } from './dto/query-project_budget.dto';
import { UpdateProjectBudgetDto } from './dto/update-project_budget.dto';



@Controller('project-budgets')
export class ProjectBudgetController {
  constructor(private readonly budgetService: ProjectBudgetService) {}

  @Post()
  create(@Body() createDto: CreateProjectBudgetDto) {
    return this.budgetService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryProjectBudgetDto) {
    return this.budgetService.findAll(query);
  }

  // Endpoint for Top Cards Summary
  @Get('summary')
  getSummary(@Query('projectUuid', ParseUUIDPipe) projectUuid: string) {
    return this.budgetService.getSummary(projectUuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.budgetService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() updateDto: UpdateProjectBudgetDto
  ) {
    return this.budgetService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.budgetService.remove(uuid);
  }

  @Patch(':uuid/restore')
  restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.budgetService.restore(uuid);
  }
}