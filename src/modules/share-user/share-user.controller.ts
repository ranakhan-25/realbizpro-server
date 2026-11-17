import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Public } from '../../common/decorators/public.decorator';
import { ShareUserAuthGuard } from './share-user-auth.guard';
import { ShareUserRoleGuard, ShareUserRoles } from './share-user-role.guard';
import { ShareUserService } from './share-user.service';
import { ShareUserRole } from '../../database/models/share-user/share-user.model';
import {
  ChangeShareUserPasswordDto,
  ForgotShareUserPasswordDto,
  LoginShareUserDto,
  RefreshShareUserTokenDto,
  RegisterShareUserDto,
  ResetShareUserPasswordDto,
  UpdateShareUserProfileDto,
  VerifyShareUserEmailDto,
} from './dto/share-user-auth.dto';

class AdminUpdateShareUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() @MinLength(8) password?: string;
}

@ApiTags('Share User')
@Controller('share-user')
export class ShareUserController {
  constructor(private readonly service: ShareUserService) {}
  @Public() @Post('register') register(@Body() dto: RegisterShareUserDto) { return this.service.register(dto); }
  @Public() @Post('login') login(@Body() dto: LoginShareUserDto) { return this.service.login(dto); }
  @Public() @Post('forgot-password') forgotPassword(@Body() dto: ForgotShareUserPasswordDto) { return this.service.forgotPassword(dto); }
  @Public() @Post('reset-password') resetPassword(@Body() dto: ResetShareUserPasswordDto) { return this.service.resetPassword(dto); }
  @Public() @Post('verify-email') verifyEmail(@Body() dto: VerifyShareUserEmailDto) { return this.service.verifyEmail(dto); }
  @Public() @Post('refresh') refresh(@Body() dto: RefreshShareUserTokenDto) { return this.service.refresh(dto); }

  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard) @Post('logout')
  logout(@Req() req: any) { return this.service.logout(req.user.id); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard) @Get('profile')
  profile(@Req() req: any) { return this.service.profile(req.user.id); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard) @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateShareUserProfileDto) { return this.service.updateProfile(req.user.id, dto); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard) @Post('change-password')
  changePassword(@Req() req: any, @Body() dto: ChangeShareUserPasswordDto) { return this.service.changePassword(req.user.id, dto); }

  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get() findAll(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.findAll(Number(page), Number(limit)); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get(':uuid') findOne(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.findOne(uuid); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Patch(':uuid/block') block(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.setBlocked(uuid, true); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Patch(':uuid/unblock') unblock(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.setBlocked(uuid, false); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Post('admin/create') adminCreate(@Body() dto: RegisterShareUserDto) { return this.service.adminCreateUser(dto); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Patch(':uuid/admin-update') adminUpdate(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: AdminUpdateShareUserDto) { return this.service.adminUpdateUser(uuid, dto); }
}
