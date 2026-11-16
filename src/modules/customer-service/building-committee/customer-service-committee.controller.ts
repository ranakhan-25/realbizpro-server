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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceCommitteeService } from './customer-service-committee.service';
import {
  CreateCommitteeMemberDto,
  UpdateCommitteeMemberDto,
  QueryCommitteeMemberDto,
  CreateCommitteeDecisionDto,
  UpdateCommitteeDecisionDto,
  QueryCommitteeDecisionDto,
} from './dto';

@ApiTags(
  'Customer Service - Building Management | Building Committee',
)
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  CustomerServiceTenantGuard,
)
@Controller('customer-service/building-committee')
export class CustomerServiceCommitteeController {
  constructor(
    private readonly committeeService: CustomerServiceCommitteeService,
  ) {}

  // =========================================================================
  // OVERVIEW / STATS
  // =========================================================================

  @Get('overview-stats')
  @ApiOperation({
    summary:
      'Committee high-level composition and decision statistics',
  })
  async getOverviewStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.committeeService.getOverviewStats(
      user,
      projectId,
    );
  }

  // =========================================================================
  // 1. COMMITTEE MEMBERS
  // =========================================================================

  @Post('members')
  @ApiOperation({
    summary:
      'Add a new member to the building committee',
  })
  async createMember(
    @CurrentUser() user: any,
    @Body() dto: CreateCommitteeMemberDto,
  ) {
    return this.committeeService.createMember(
      user,
      dto,
    );
  }

  @Get('members')
  @ApiOperation({
    summary:
      'List committee members with filters and search',
  })
  async listMembers(
    @CurrentUser() user: any,
    @Query() query: QueryCommitteeMemberDto,
  ) {
    return this.committeeService.listMembers(
      user,
      query,
    );
  }

  @Get('members/:uuid')
  @ApiOperation({
    summary: 'Get committee member details',
  })
  async getMember(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.committeeService.getMember(
      user,
      uuid,
    );
  }

  @Patch('members/:uuid')
  @ApiOperation({
    summary:
      'Update committee member information',
  })
  async updateMember(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateCommitteeMemberDto,
  ) {
    return this.committeeService.updateMember(
      user,
      uuid,
      dto,
    );
  }

  @Delete('members/:uuid')
  @ApiOperation({
    summary: 'Remove a committee member',
  })
  async deleteMember(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.committeeService.deleteMember(
      user,
      uuid,
    );
  }

  // =========================================================================
  // 2. COMMITTEE DECISIONS & RESOLUTIONS
  // =========================================================================

  @Post('decisions')
  @ApiOperation({
    summary:
      'Log a committee meeting decision / resolution',
  })
  async createDecision(
    @CurrentUser() user: any,
    @Body() dto: CreateCommitteeDecisionDto,
  ) {
    return this.committeeService.createDecision(
      user,
      dto,
    );
  }

  @Get('decisions')
  @ApiOperation({
    summary:
      'List meeting decisions and resolutions',
  })
  async listDecisions(
    @CurrentUser() user: any,
    @Query() query: QueryCommitteeDecisionDto,
  ) {
    return this.committeeService.listDecisions(
      user,
      query,
    );
  }

  @Patch('decisions/:uuid')
  @ApiOperation({
    summary:
      'Update meeting decision status or notes',
  })
  async updateDecision(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateCommitteeDecisionDto,
  ) {
    return this.committeeService.updateDecision(
      user,
      uuid,
      dto,
    );
  }

  @Delete('decisions/:uuid')
  @ApiOperation({
    summary: 'Delete a committee decision',
  })
  async deleteDecision(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.committeeService.deleteDecision(
      user,
      uuid,
    );
  }
}
