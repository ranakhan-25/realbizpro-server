import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  CACHE_PREFIX_METADATA,
} from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(
    CacheInterceptor.name,
  );

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    const ttl = this.reflector.get(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );
    const customPrefix = this.reflector.get(
      CACHE_PREFIX_METADATA,
      context.getHandler(),
    );

    if (!key) {
      return next.handle();
    }

    const request = context
      .switchToHttp()
      .getRequest();
    const cacheKey = this.buildCacheKey(
      key,
      request,
    );

    // Use custom prefix if provided, otherwise use controller's base route
    const prefix =
      customPrefix ||
      this.getControllerPrefix(context);

    try {
      // Try to get from cache first
      const cachedResult =
        await this.cacheService.get(cacheKey, {
          prefix,
        });

      if (cachedResult !== null) {
        this.logger.debug(
          `Cache hit for key: ${prefix}:${cacheKey}`,
        );
        return of(cachedResult);
      }

      // If not in cache, execute the method and cache the result
      this.logger.debug(
        `Cache miss for key: ${prefix}:${cacheKey}`,
      );
      return next.handle().pipe(
        tap(async (result) => {
          if (
            result !== undefined &&
            result !== null
          ) {
            await this.cacheService.set(
              cacheKey,
              result,
              { ttl, prefix },
            );
            this.logger.debug(
              `Cached result for key: ${prefix}:${cacheKey}`,
            );
          }
        }),
      );
    } catch (error) {
      this.logger.error(
        `Cache error for key ${prefix}:${cacheKey}:`,
        error,
      );
      // On cache error, fall back to executing the method
      return next.handle();
    }
  }

  private getControllerPrefix(
    context: ExecutionContext,
  ): string {
    const controller = context.getClass();

    // Get the controller path from @Controller decorator
    const controllerPath =
      this.reflector.get('path', controller) ||
      this.reflector.get(
        '__controller-path__',
        controller,
      );

    if (controllerPath) {
      return controllerPath;
    }

    // Fallback: extract from controller class name
    const controllerName =
      controller.name.toLowerCase();
    if (controllerName.endsWith('controller')) {
      return controllerName.replace(
        'controller',
        '',
      );
    }

    return controllerName;
  }

  private buildCacheKey(
    template: string,
    request: any,
  ): string {
    let cacheKey = template;

    // Replace placeholders with actual values from request
    const params = request.params || {};
    const query = request.query || {};
    const user = request.user || {};

    // Replace :param placeholders
    Object.keys(params).forEach((param) => {
      cacheKey = cacheKey.replace(
        `:${param}`,
        params[param],
      );
    });

    // Replace {query} placeholders
    Object.keys(query).forEach((queryParam) => {
      cacheKey = cacheKey.replace(
        `{${queryParam}}`,
        query[queryParam],
      );
    });

    // Replace user-related placeholders
    if (user.id) {
      cacheKey = cacheKey.replace(
        '{userId}',
        user.id,
      );
    }
    if (user.email) {
      cacheKey = cacheKey.replace(
        '{userEmail}',
        user.email,
      );
    }

    return cacheKey;
  }
}
