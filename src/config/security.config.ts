import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SecurityConfig } from 'src/common/types/securityConfig.type';
import validateConfig from './validate.config';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  RATE_LIMIT_MAX: number;

  @IsInt()
  @Min(1000)
  @Max(3600000)
  @IsOptional()
  RATE_LIMIT_WINDOW_MS: number;

  @IsBoolean()
  @IsOptional()
  CORS_CREDENTIALS: boolean;

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string;

  @IsString()
  @IsOptional()
  CORS_METHODS: string;

  @IsString()
  @IsOptional()
  CORS_ALLOWED_HEADERS: string;

  @IsString()
  @IsOptional()
  CORS_EXPOSED_HEADERS: string;

  @IsInt()
  @Min(0)
  @Max(86400)
  @IsOptional()
  CORS_MAX_AGE: number;

  //JWT_SECRET
  @IsString()
  @IsOptional()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  BLACKLISTED_IPS: string; // Comma-separated list of IPs
}

export default registerAs<SecurityConfig>(
  'security',
  () => {
    validateConfig(
      process.env,
      EnvironmentVariablesValidator,
    );

    return {
      rateLimit: {
        max: process.env.RATE_LIMIT_MAX
          ? parseInt(
              process.env.RATE_LIMIT_MAX,
              10,
            )
          : 100,
        windowMs: process.env.RATE_LIMIT_WINDOW_MS
          ? parseInt(
              process.env.RATE_LIMIT_WINDOW_MS,
              10,
            )
          : 15 * 60 * 1000, // 15 minutes
      },
      cors: {
        credentials:
          process.env.CORS_CREDENTIALS === 'true',
        origin: process.env.CORS_ORIGIN || true,
        methods: process.env.CORS_METHODS?.split(
          ',',
        ) || [
          'GET',
          'POST',
          'PUT',
          'DELETE',
          'PATCH',
          'OPTIONS',
        ],
        allowedHeaders:
          process.env.CORS_ALLOWED_HEADERS?.split(
            ',',
          ) || [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'X-API-KEY',
          ],
        exposedHeaders:
          process.env.CORS_EXPOSED_HEADERS?.split(
            ',',
          ) || [
            'X-Total-Count',
            'X-Page-Count',
            'Content-Disposition',
            'Content-Length',
            'Content-Type',
          ],
        maxAge: process.env.CORS_MAX_AGE
          ? parseInt(process.env.CORS_MAX_AGE, 10)
          : 86400, // 24 hours
      },
      jwtSecret:
        process.env.JWT_SECRET ||
        'default_jwt_secret',
      jwtExpiresIn:
        process.env.JWT_EXPIRES_IN ?? '1d',
      blacklistedIps: process.env.BLACKLISTED_IPS
        ? process.env.BLACKLISTED_IPS.split(
            ',',
          ).map((ip) => ip.trim())
        : [],
    };
  },
);
