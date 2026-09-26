import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(
    AuthLoggingInterceptor.name,
  );

  constructor(
    private readonly configService: ConfigService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest();
    const { method, url, ip, headers } = request;
    const user = request.user;

    const userInfo = user
      ? `User: ${user.username} (ID: ${user.id})`
      : 'Anonymous';

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        try {
          const duration = Date.now() - startTime;
          this.logger.log(
            `${method} ${url} - ${userInfo} - Completed in ${duration}ms`,
          );

          const threshold =
            this.configService.get<number>(
              'app.performanceWarningThreshold',
            ) || 3000;

          if (duration > threshold) {
            this.logger.warn(
              `PERFORMANCE WARNING: ${method} ${url} took ${duration}ms (Threshold: ${threshold}ms)`,
            );
            // void this.sendPerformanceWarningEmail(
            //   request,
            //   duration,
            // );
          }
        } catch (error) {
          this.logger.error(
            'Failed to process auth logging side effects',
            error instanceof Error
              ? error.stack
              : String(error),
          );
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `${method} ${url} - ${userInfo} - Failed in ${duration}ms - Error: ${error.message}`,
        );
        throw error;
      }),
    );
  }

  private async sendPerformanceWarningEmail(
    request: any,
    duration: number,
  ): Promise<void> {
    try {
      const {
        method,
        url,
        ip,
        headers,
        body,
        query,
        user,
      } = request;
      const adminEmails =
        process.env.ADMIN_EMAILS?.split(',') || [
          'admin@example.com',
        ];

      // await this.emailService.sendMail({
      //   to: adminEmails,
      //   subject: `🐢 Performance Warning: ${method} ${url}`,
      //   template: 'performance-warning',
      //   context: {
      //     duration,
      //     threshold:
      //       this.configService.get<number>(
      //         'app.performanceWarningThreshold',
      //       ) || 3000,
      //     path: `${method} ${url}`,
      //     timestamp: new Date().toISOString(),
      //     userEmail: user?.email || 'Anonymous',
      //     userId: user?.id || 'N/A',
      //     ip,
      //     userAgent:
      //       headers['user-agent'] || 'Unknown',
      //     body: this.safeSerialize(body),
      //     query: this.safeSerialize(query),
      //   },
      // });
    } catch (error) {
      this.logger.error(
        'Failed to send performance warning email',
        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }

  private safeSerialize(
    value: unknown,
  ): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Unserializable payload]';
    }
  }
}
