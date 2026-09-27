import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { AllConfigType } from '../types/config.type';

export function setupSwagger(
  app: INestApplication,
) {
  const configService = app.get(
    ConfigService<AllConfigType>,
  );

  const nodeEnv = configService.get(
    'app.nodeEnv',
    { infer: true },
  );
  const apiPrefix =
    configService.get('app.apiPrefix', {
      infer: true,
    }) || 'api';
  const port =
    configService.get('app.port', {
      infer: true,
    }) || 5000;

  const rawBackendDomain =
    configService.get('app.backendDomain', {
      infer: true,
    }) || 'http://localhost';

  if (nodeEnv !== 'production') {
    // Remove trailing slash
    const cleanedBackendDomain =
      rawBackendDomain.replace(/\/+$/, '');

    // ========= DOMAIN DETECTION LOGIC =========
    //
    // Add port ONLY IF backendDomain is:
    //  1. localhost
    //  2. IP address (v4)
    //
    // Do NOT add port if backendDomain is a real domain name.
    //
    // ==========================================

    const isLocalhost =
      cleanedBackendDomain.includes('localhost');

    const isIpAddress =
      /^https?:\/\/(\d{1,3}\.){3}\d{1,3}$/.test(
        cleanedBackendDomain,
      );

    const shouldAppendPort =
      isLocalhost || isIpAddress;

    // Final Base URL
    const baseUrl = shouldAppendPort
      ? `${cleanedBackendDomain}:${port}`
      : cleanedBackendDomain;

    console.log(
      '🚀 Final Swagger Base URL:',
      baseUrl,
    );

    const config = new DocumentBuilder()
      .setTitle('RealBiz Pro API')
      .setDescription(
        'Comprehensive API documentation for RealBiz Pro application',
      )
      .setVersion('1.0.0')
      .addServer(baseUrl, 'Development Server')
      .addServer(
        'http://localhost:5003',
        'Local Network Server',
      )
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      })
      .build();

    const document = SwaggerModule.createDocument(
      app,
      config,
      {
        operationIdFactory: (
          controllerKey: string,
          methodKey: string,
        ) => methodKey,
        deepScanRoutes: true,
        ignoreGlobalPrefix: false,
      },
    );

    const swaggerOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
      },
      customSiteTitle:
        'RealBiz Pro API Documentation',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #4EAC3A }
      `,
      customfavIcon: '/favicon.ico',
    };

    const swaggerPath =
      `realbiz_pro/${apiPrefix}/docs`.replace(
        /^\/+/,
        '',
      );

    SwaggerModule.setup(
      swaggerPath,
      app,
      document,
      swaggerOptions,
    );

    console.log(
      `📚 Swagger documentation configured at: /${swaggerPath}`,
    );
    console.log(
      `📚 Swagger JSON available at: /${swaggerPath}-json`,
    );
  }
}
