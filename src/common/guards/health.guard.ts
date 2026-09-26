import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../types/config.type';

@Injectable()
export class HealthCheckGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const healthCheckEnabled =
      this.configService.get(
        'app.healthCheckEnabled',
        { infer: true },
      );

    if (!healthCheckEnabled) {
      throw new ForbiddenException(
        'Health check endpoints are disabled',
      );
    }

    return true;
  }
}
