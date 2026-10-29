/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUserId } from '../../../common/decorators/auth.decorators';
import { Public } from '../../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { SysMenuLocation } from '../../../database/models/system/sys_menu.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { ModuleWithMenuTreeResponseDto } from '../../menu/dto/response.dto';
import { MenuService } from '../../menu/menu.service';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import {
  ChangePasswordDto,
  RefreshTokenDto,
  UpdateProfileDto,
} from './dto/common.dto';
import { DemoBookDto } from './dto/demo-book.dto';
import {
  DemoBookQueryDto,
  UpdateDemoBookMeetingTimeDto,
} from './dto/demo-book-query.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    username: string;
  };
}

@ApiTags('System | Authentication')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly menuService: MenuService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress =
      req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(loginDto, {
      ipAddress,
      userAgent,
    });
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress =
      req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.register(
      registerDto,
      { ipAddress, userAgent },
    );
  }

  @Public()
  @Post('demobook')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Book a demo (public)',
  })
  @ApiResponse({
    status: 201,
    description:
      'Demo booking submitted successfully',
  })
  async createDemoBook(
    @Body() demoBookDto: DemoBookDto,
  ) {
    return this.authService.createDemoBook(
      demoBookDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('demobook')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get demo bookings list (paginated, with search & date filter)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Demo bookings retrieved successfully',
  })
  async findAllDemoBooks(
    @Query() query: DemoBookQueryDto,
  ) {
    return this.authService.findAllDemoBooks(
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('demobook/:uuid')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a single demo booking by uuid',
  })
  @ApiResponse({
    status: 200,
    description:
      'Demo booking retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Demo booking not found',
  })
  async findOneDemoBook(
    @Param('uuid') uuid: string,
  ) {
    return this.authService.findOneDemoBook(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('demobook/:uuid')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Set/update meeting time for a demo booking',
  })
  @ApiResponse({
    status: 200,
    description:
      'Meeting time updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Demo booking not found',
  })
  async updateDemoBookMeetingTime(
    @Param('uuid') uuid: string,
    @Body()
    updateDto: UpdateDemoBookMeetingTimeDto,
  ) {
    return this.authService.updateDemoBookMeetingTime(
      uuid,
      updateDto,
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress =
      req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshToken(
      refreshTokenDto,
      {
        ipAddress,
        userAgent,
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Change user password',
  })
  @ApiResponse({
    status: 204,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect',
  })
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }

  @Get('permitted-menus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get permitted modules with menu trees for current user',
    description:
      'Returns modules with menu trees that the user has access to, sorted by order field. Only shows menus the user has permission to access based on their roles.',
  })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    type: Number,
    description: 'Filter by specific module ID',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    enum: SysMenuLocation,
    isArray: true,
    description:
      'Filter by menu locations (can specify multiple)',
    example: ['SIDEBAR', 'HEADER'],
  })
  @ApiResponse({
    status: 200,
    description:
      'Permitted modules with menu trees retrieved successfully',
    type: [ModuleWithMenuTreeResponseDto],
  })
  async findPermittedModulesWithMenuTree(
    @CurrentUserId() reqUserId: number,
    @Query('moduleId') moduleId?: string,
    @Query('location')
    location?:
      SysMenuLocation | SysMenuLocation[],
  ): Promise<ModuleWithMenuTreeResponseDto[]> {
    const moduleIdNumber = moduleId
      ? +moduleId
      : undefined;
    let locationFilter:
      | SysMenuLocation
      | SysMenuLocation[]
      | undefined;
    if (location) {
      locationFilter = location;
    }
    return this.menuService.findPermittedModulesWithMenuTree(
      reqUserId,
      moduleIdNumber,
      locationFilter,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({
    summary: 'Update user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: SysUser,
  })
  @ApiResponse({
    status: 409,
    description:
      'Email or username already in use',
  })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<SysUser> {
    return this.authService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: SysUser,
  })
  async getProfile(
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    return this.authService.getUserData(
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Logout current session',
  })
  @ApiResponse({
    status: 204,
    description: 'Logout successful',
  })
  async logout(
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    const token =
      req.headers.authorization?.replace(
        'Bearer ',
        '',
      );
    return this.authService.logout(
      req.user.id,
      token,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Logout all sessions',
  })
  @ApiResponse({
    status: 204,
    description:
      'All sessions logged out successfully',
  })
  async logoutAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.authService.logoutAll(
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  @ApiOperation({
    summary: 'Validate current token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean' },
        user: { type: 'object' },
      },
    },
  })
  async validateToken(
    @Req() req: AuthenticatedRequest,
  ) {
    const user =
      await this.authService.validateUser(
        req.user.id,
      );
    return {
      valid: !!user,
      user: user
        ? {
            id: user.id,
            email: user.email,
            username: user.username,
            isActive: user.isActive,
          }
        : null,
    };
  }
}
