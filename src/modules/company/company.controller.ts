import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/auth.decorators';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CompanyService } from './company.service';
import { AssignUserCompaniesDto } from './dto/assign-company.dto';
import { SelectCompanyDto } from './dto/select-company.dto';

@ApiTags('System | Company Management')
@Controller('company')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) {}

  @Post('select')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Select active company for the current user session',
  })
  @ApiResponse({
    status: 200,
    description: 'Company selected successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'User not assigned to company',
  })
  async selectCompany(
    @CurrentUser() user: any,
    @Body() dto: SelectCompanyDto,
  ) {
    return this.companyService.selectCompany(
      user,
      dto.company_id,
    );
  }

  @Get('selected')
  @ApiOperation({
    summary:
      'Get currently selected active company for the session',
  })
  @ApiResponse({
    status: 200,
    description:
      'Active company details retrieved',
  })
  async getSelectedCompany(
    @CurrentUserId() userId: number,
  ) {
    return this.companyService.getSelectedCompany(
      userId,
    );
  }

  @Get('my-companies')
  @ApiOperation({
    summary:
      'Get all companies assigned to the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assigned companies',
  })
  async getMyCompanies(@CurrentUser() user: any) {
    return this.companyService.getUserCompanies(
      user.id,
      !!user.isSuperUser,
    );
  }

  @Post('assign')
  @Permissions('assign_user_companies')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Assign user to one or multiple companies',
  })
  @ApiResponse({
    status: 200,
    description:
      'User companies updated successfully',
  })
  async assignUserCompanies(
    @CurrentUserId() operatorId: number,
    @Body() dto: AssignUserCompaniesDto,
  ) {
    return this.companyService.assignUserCompanies(
      dto.user_id,
      dto.company_ids,
      operatorId,
    );
  }
}
