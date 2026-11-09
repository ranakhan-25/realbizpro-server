import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense_list.service';
import { CreateExpenseDto } from './dto/create-expense_list.dto';
import { QueryExpenseDto } from './dto/query-expense_list.dto';
import { UpdateExpenseDto } from './dto/update-expense_list.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('Accounts | vouchers | expense-list')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @Permissions('create_expense')
  @ApiOperation({ summary: 'Create expense' })
  create(
    @Body() dto: CreateExpenseDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_expense')
  @ApiOperation({ summary: 'List expenses' })
  findAll(
    @Query() query: QueryExpenseDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_expense')
  @ApiOperation({ summary: 'Get expense by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_expense')
  @ApiOperation({ summary: 'Update expense (PATCH)' })
  updateWithPatch(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateExpenseDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseService.update(uuid, dto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_expense')
  @ApiOperation({ summary: 'Update expense (PUT)' })
  updateWithPut(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateExpenseDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_expense')
  @ApiOperation({ summary: 'Delete expense' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_expense')
  @ApiOperation({ summary: 'Restore expense' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.expenseService.restore(uuid, userId, currentUser);
  }
}
