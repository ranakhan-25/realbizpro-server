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
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { InvestorService } from './investor.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { QueryInvestorDto } from './dto/query-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

@ApiTags('Project | Investments | Investor')
@ApiBearerAuth()
@Controller('investor')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvestorController {
  constructor(
    private readonly investorService: InvestorService,
  ) {}

  @Post()
  @Permissions('create_investor')
  @ApiOperation({
    summary: 'Create a new investor',
  })
  create(
    @Body() createInvestorDto: CreateInvestorDto,
  ) {
    return this.investorService.create(
      createInvestorDto,
    );
  }

  @Get()
  @Permissions('view_investors')
  @ApiOperation({
    summary: 'Get all investors (paginated)',
  })
  findAll(@Query() query: QueryInvestorDto) {
    return this.investorService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_investor')
  @ApiOperation({
    summary: 'Get investor by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.investorService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_investor')
  @ApiOperation({ summary: 'Update investor' })
  update(
    @Param('uuid') uuid: string,
    @Body() updateInvestorDto: UpdateInvestorDto,
  ) {
    return this.investorService.update(
      uuid,
      updateInvestorDto,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_investor')
  @ApiOperation({
    summary:
      'Soft delete investor (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.investorService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_investor')
  @ApiOperation({
    summary:
      'Restore soft-deleted investor (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.investorService.restore(uuid);
  }
}
