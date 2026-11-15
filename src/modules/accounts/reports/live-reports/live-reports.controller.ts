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
import { LiveReportsService } from './live-reports.service';

@ApiTags('Accounts | live reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('accounts/reports')
export class LiveReportsController {
  constructor(
    private readonly reportsService: LiveReportsService,
  ) {}

  @Get(':reportKey')
  @ApiOperation({
    summary:
      'Generate an Accounts report from live voucher and chart-of-accounts data',
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
