import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Paginate,
  PaginateParams,
} from 'src/common/decorators/paginate.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CurrentUserId } from '../../common/decorators/auth.decorators';
import { PaginateDto } from '../../common/dto/paginate.dto';
import { PaginateHelper } from '../../common/helper/paginate.helper';
import { CreateModuleUserDto } from './dto/create-module-user.dto';
import { UpdateModuleUserDto } from './dto/update-module-user.dto';
import { ModuleUserService } from './module-user.service';

@ApiTags('System | User-Module Assignments')
@Controller('user-modules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ModuleUserController {
  constructor(
    private readonly moduleUserService: ModuleUserService,
  ) {}

  @Post()
  @Permissions('assign_user_modules')
  @ApiOperation({
    summary: 'Assign modules to a user',
    description:
      'Replaces all existing module assignments for the user with the new set.',
  })
  @ApiBody({ type: CreateModuleUserDto })
  @ApiResponse({
    status: 201,
    description: 'Modules assigned successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User or Module not found.',
  })
  assignModulesToUser(
    @Body() createDto: CreateModuleUserDto,
  ) {
    return this.moduleUserService.assignModulesToUser(
      createDto,
    );
  }

  @Get()
  @Permissions('view_user_modules')
  @ApiOperation({
    summary:
      'Get a paginated list of users with their assigned modules',
  })
  @ApiResponse({
    status: 200,
    description:
      'Paginated list of users and their modules.',
  })
  @ApiQuery({ type: PaginateDto })
  async findAndCountAll(
    @Paginate({
      maxLimit: 50,
    })
    paginateParams: PaginateParams,
  ) {
    const [users, total] =
      await this.moduleUserService.findAndCountAll(
        paginateParams,
      );
    return PaginateHelper.response(
      users,
      total,
      paginateParams,
    );
  }

  @Get('own-permitted-modules')
  @ApiOperation({
    summary:
      'Get a single user with their assigned modules',
  })
  @ApiResponse({
    status: 200,
    description:
      'User with their assigned modules.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findModulesForUser(
    @CurrentUserId() userId: number,
  ) {
    return this.moduleUserService.findModulesForUser(
      +userId,
    );
  }

  @Get(':userId')
  @Permissions('view_user_modules')
  @ApiOperation({
    summary:
      'Get a single user with their assigned modules',
  })
  @ApiResponse({
    status: 200,
    description:
      'User with their assigned modules.',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findModulesForOneUser(
    @Param('userId') userId: string,
  ) {
    return this.moduleUserService.findModulesForUser(
      +userId,
    );
  }

  @Put()
  @Permissions('assign_user_modules')
  @ApiOperation({
    summary:
      'Update module assignments for a user',
    description:
      'Replaces all existing module assignments for the user with the new set.',
  })
  @ApiBody({ type: UpdateModuleUserDto })
  @ApiResponse({
    status: 200,
    description:
      'Module assignments updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User or Module not found.',
  })
  update(@Body() updateDto: UpdateModuleUserDto) {
    return this.moduleUserService.update(
      updateDto,
    );
  }

  @Delete(':userId')
  @Permissions('assign_user_modules')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Remove all module assignments from a user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description:
      'All modules removed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  removeAllModulesFromUser(
    @Param('userId') userId: string,
  ) {
    return this.moduleUserService.removeAllModulesFromUser(
      +userId,
    );
  }
}
