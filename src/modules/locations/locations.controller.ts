import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all divisions and districts of Bangladesh',
    description: 'Returns all 8 divisions and 64 districts with English and Bengali names.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search division or district' })
  @ApiQuery({ name: 'division', required: false, description: 'Filter by division name or ID' })
  getAll(
    @Query('search') search?: string,
    @Query('division') division?: string,
  ) {
    return this.service.getAll(search, division);
  }

  @Public()
  @Get('divisions')
  @ApiOperation({
    summary: 'Get all 8 divisions of Bangladesh with their districts',
    description: 'Returns list of 8 divisions with total district count and district list.',
  })
  getDivisions() {
    return this.service.getDivisions();
  }

  @Public()
  @Get('districts')
  @ApiOperation({
    summary: 'Get all 64 districts of Bangladesh',
    description: 'Returns all districts or filtered by division name or search keyword.',
  })
  @ApiQuery({ name: 'division', required: false, description: 'Division name (e.g., Dhaka, Chattogram)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search district by name or bnName' })
  getDistricts(
    @Query('division') division?: string,
    @Query('search') search?: string,
  ) {
    return this.service.getDistricts(division, search);
  }

  @Public()
  @Get('districts/:name')
  @ApiOperation({
    summary: 'Get single district details by name',
  })
  getDistrictByName(@Param('name') name: string) {
    return this.service.getDistrictByName(name);
  }
}
