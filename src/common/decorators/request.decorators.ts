// request-decorators.ts - Request processing decorators
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Extract client's real IP address
 * Checks X-Forwarded-For, X-Real-IP headers and connection info
 */
export const RealIP = createParamDecorator(
  (
    data: unknown,
    ctx: ExecutionContext,
  ): string => {
    const request: Request = ctx
      .switchToHttp()
      .getRequest();

    // Check various headers for real IP
    const xForwardedFor = request.headers[
      'x-forwarded-for'
    ] as string;
    const xRealIP = request.headers[
      'x-real-ip'
    ] as string;
    const cfConnectingIP = request.headers[
      'cf-connecting-ip'
    ] as string; // Cloudflare
    const xClientIP = request.headers[
      'x-client-ip'
    ] as string;

    // Return first available IP
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    if (cfConnectingIP) return cfConnectingIP;
    if (xRealIP) return xRealIP;
    if (xClientIP) return xClientIP;

    // Fallback to connection info
    return (
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      (request as any).ip ||
      '0.0.0.0'
    );
  },
);

/**
 * Extract user agent string from request headers
 */
export const UserAgent = createParamDecorator(
  (
    data: unknown,
    ctx: ExecutionContext,
  ): string => {
    const request: Request = ctx
      .switchToHttp()
      .getRequest();
    return (
      request.headers['user-agent'] || 'Unknown'
    );
  },
);
