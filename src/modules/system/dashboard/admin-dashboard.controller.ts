import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  AdminDashboardService,
  DashboardStatsResponse,
} from './admin-dashboard.service';

@ApiTags('System | Admin Dashboard Analytics')
@Controller('system/dashboard')
export class AdminDashboardController {
  constructor(
    private readonly dashboardService: AdminDashboardService,
  ) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get dynamic admin dashboard statistics and analytics',
    description:
      'Returns platform wide metrics for Super Admins or tenant-scoped operational metrics for Organization Admins',
  })
  @ApiResponse({
    status: 200,
    description:
      'Dashboard statistics retrieved successfully',
  })
  async getDashboardStats(
    @Req() req: any,
  ): Promise<DashboardStatsResponse> {
    return this.dashboardService.getDashboardStats(
      req.user,
    );
  }
}
