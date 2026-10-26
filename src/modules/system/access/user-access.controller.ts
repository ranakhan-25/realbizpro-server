import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserAccessService, UserAccessResponse } from './user-access.service';

@ApiTags('System | User Access & Entitlements')
@Controller('system/user-access')
export class UserAccessController {
  constructor(private readonly accessService: UserAccessService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get authenticated user profile and accessible modules from pivot tables',
    description:
      'Extracts user identity from JWT and computes permitted ERP modules, features, and route paths based on tenant entitlements and role privileges',
  })
  @ApiResponse({
    status: 200,
    description: 'User access configuration retrieved successfully',
  })
  async getUserAccess(@Req() req: any): Promise<UserAccessResponse> {
    return this.accessService.getUserAccess(req.user);
  }
}
