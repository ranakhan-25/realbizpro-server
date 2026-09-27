import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { AppConfig } from 'src/common/types/appConfig.type';
import validateConfig from './validate.config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsBoolean()
  @IsOptional()
  HEALTH_CHECK_ENABLED: boolean;

  @IsString()
  @IsOptional()
  SWAGGER_PATH: string;

  @IsString()
  @IsOptional()
  PERFORMANCE_WARNING_THRESHOLD: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  MAX_DISCOUNT_PERCENT: number;

  @IsBoolean()
  @IsOptional()
  REQUIRE_SALESMAN: boolean;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  SALES_COMMISSION_PERCENT: number;
}

export default registerAs<AppConfig>(
  'app',
  () => {
    validateConfig(
      process.env,
      EnvironmentVariablesValidator,
    );

    return {
      nodeEnv:
        process.env.NODE_ENV || 'development',
      name: process.env.APP_NAME || 'app',
      workingDirectory:
        process.env.PWD || process.cwd(),
      frontendDomain: process.env.FRONTEND_DOMAIN,
      backendDomain:
        process.env.BACKEND_DOMAIN ??
        'http://localhost',
      port: process.env.APP_PORT
        ? parseInt(process.env.APP_PORT, 10)
        : process.env.PORT
          ? parseInt(process.env.PORT, 10)
          : 3000,
      apiPrefix: process.env.API_PREFIX || 'api',
      healthCheckEnabled:
        process.env.HEALTH_CHECK_ENABLED ===
        'true',
      swaggerPath:
        process.env.SWAGGER_PATH || 'docs',
      performanceWarningThreshold:
        parseInt(
          process.env
            .PERFORMANCE_WARNING_THRESHOLD ??
            `3000`,
          10,
        ) || 3000,
      maxDiscountPercent:
        parseInt(
          process.env.MAX_DISCOUNT_PERCENT ??
            `30`,
          10,
        ) || 30,
      requireSalesman:
        process.env.REQUIRE_SALESMAN !== 'false',
      salesCommissionPercent:
        parseInt(
          process.env.SALES_COMMISSION_PERCENT ??
            `1`,
          10,
        ) || 1,
    };
  },
);
