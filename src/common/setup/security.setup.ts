import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import helmet from 'helmet';
import { AllConfigType } from '../types/config.type';

export function securitySetup(
  app: INestApplication,
) {
  const configService = app.get(
    ConfigService<AllConfigType>,
  );
  const nodeEnv = configService.get(
    'app.nodeEnv',
    { infer: true },
  );
  const securityConfig = configService.get(
    'security',
    { infer: true },
  );
  const isProduction = nodeEnv === 'production';

  // Trust proxy
  app
    .getHttpAdapter()
    .getInstance()
    .set('trust proxy', 1);

  // IP Blacklist Middleware
  const blacklistedIps =
    securityConfig?.blacklistedIps || [];
  if (blacklistedIps.length > 0) {
    app.use(
      (
        req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        const ip = getClientIp(req);

        if (blacklistedIps.includes(ip)) {
          res
            .status(403)
            .json({ message: 'Forbidden' });
          return; // Don't call next() after sending response
        }

        next();
      },
    );
    console.log(
      `🔒 IP Blacklist enabled for: [${blacklistedIps.join(', ')}]`,
    );
  }

  // Compression (always enabled)
  app.use(compression());

  if (isProduction) {
    // PRODUCTION - Full security enabled
    const productionOrigins = [
      'http://217.217.248.182',
      'http://217.217.248.182',
      'http://192.168.150.90',
      'http://192.168.150.86',
      'http://192.168.150.45',
      'http://192.168.150.20',
      'http://192.168.150.19',
      'http://192.168.110.120',
      'http://192.168.150.91',
      'http://192.168.150.122',
      'http://localhost',
      'http://127.0.0.1',
      'http://192.168.150.22',
      'https://easysofts.net',
      'https://api.easysofts.net',
    ];

    // Helmet with full security
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'none'"],
            connectSrc: [
              "'self'",
              ...productionOrigins,
            ],
            scriptSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
            ],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'"],
          },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        frameguard: { action: 'deny' },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
        referrerPolicy: { policy: 'no-referrer' },
      }),
    );

    // Strict CORS for production
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }
        const originwithoutport = origin
          ? origin.replace(/:\d+$/, '')
          : undefined;

        if (
          productionOrigins.includes(
            originwithoutport,
          )
        ) {
          callback(null, true);
        } else {
          callback(
            new Error('Not allowed by CORS'),
          );
        }
      },
      credentials:
        securityConfig?.cors?.credentials ?? true,
      methods: securityConfig?.cors?.methods || [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'OPTIONS',
      ],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-KEY',
        'X-CSRF-Token',
      ],
      exposedHeaders: securityConfig?.cors
        ?.exposedHeaders || [
        'X-Total-Count',
        'X-Page-Count',
        'Content-Disposition',
        'Content-Length',
        'Content-Type',
      ],
      maxAge:
        securityConfig?.cors?.maxAge || 86400,
      optionsSuccessStatus: 200,
    });

    console.log('🔒 Production security enabled');
  } else {
    // DEVELOPMENT - ALL SECURITY BYPASSED
    console.log(
      '⚠️  DEVELOPMENT MODE: All security bypassed',
    );

    // Helmet completely disabled
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        dnsPrefetchControl: false,
        frameguard: false,
        hidePoweredBy: false,
        hsts: false,
        ieNoOpen: false,
        noSniff: false,
        originAgentCluster: false,
        permittedCrossDomainPolicies: false,
        referrerPolicy: false,
        xssFilter: false,
      }),
    );

    // CORS completely open
    app.enableCors({
      origin: true, // Allow ALL origins
      credentials: true,
      methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'OPTIONS',
        'HEAD',
      ],
      allowedHeaders: '*', // Allow ALL headers
      exposedHeaders: '*', // Expose ALL headers
      maxAge: 86400,
      optionsSuccessStatus: 200,
      preflightContinue: false,
    });
  }
}

// Helper function to get client IP address
function getClientIp(req: Request): string {
  const forwarded = req.headers[
    'x-forwarded-for'
  ] as string;
  return forwarded
    ? forwarded.split(',')[0]
    : req.connection.remoteAddress || 'unknown';
}
