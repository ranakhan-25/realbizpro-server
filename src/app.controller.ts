import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Get({ version: VERSION_NEUTRAL })
  @Public()
  getRoot() {
    return {
      status: 'ok',
      service: 'RealBiz Pro API',
      message: 'Server is running successfully on Render!',
      health: '/realbizpro/api/v1/health',
      timestamp: new Date().toISOString(),
    };
  }
}
