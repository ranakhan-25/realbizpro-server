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
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { LiveHrmReportsService } from './live-hrm-reports.service';

@ApiTags('HRM | reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('hrm/reports')
export class LiveHrmReportsController {
  constructor(
    private readonly reportsService: LiveHrmReportsService,
  ) {}

  @Get(':reportKey')
  @ApiOperation({
    summary:
      'Generate an HRM report from attendance, leave, and payroll records',
  })
  getReport(
    @Param('reportKey') reportKey: string,
    @Query()
    query: Record<string, string | undefined>,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    return this.reportsService.generate(
      reportKey,
      query,
      user,
    );
  }
}
