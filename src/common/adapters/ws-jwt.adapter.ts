import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import {
  Server,
  ServerOptions,
  Socket,
} from 'socket.io';

export class WsJwtAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  override createIOServer(
    port: number,
    options?: ServerOptions,
  ): any {
    console.log(
      '[WS-ADAPTER] 🚀 Creating WebSocket server...',
    );

    const server: Server = super.createIOServer(
      port,
      {
        ...options,
        cors: {
          origin: '*',
          credentials: true,
        },
      },
    );

    console.log(
      '[WS-ADAPTER] ✅ WebSocket server created, registering middleware',
    );

    server.use(async (socket: Socket, next) => {
      console.log(
        '[WS-ADAPTER] 🔍 Middleware called for new connection',
      );
      console.log(
        '[WS-ADAPTER] Auth data:',
        socket.handshake.auth,
      );

      try {
        const token =
          socket.handshake.auth?.token?.replace(
            'Bearer ',
            '',
          ) ||
          socket.handshake.headers?.authorization?.replace(
            'Bearer ',
            '',
          );

        console.log(
          '[WS-ADAPTER] Token received:',
          token ? 'YES' : 'NO',
        );

        if (!token) {
          console.log(
            '[WS-ADAPTER] ❌ No token provided, rejecting connection',
          );
          return next(
            new Error(
              'Authentication token required',
            ),
          );
        }

        const jwtService =
          this.app.get(JwtService);
        const jwtSecret =
          this.configService.get<string>(
            'security.jwtSecret',
          );

        console.log(
          '[WS-ADAPTER] Verifying token...',
        );

        // Verify and decode JWT token
        const payload = jwtService.verify(token, {
          secret: jwtSecret,
        });

        console.log(
          '[WS-ADAPTER] Token payload:',
          {
            sub: payload.sub,
            username: payload.username,
          },
        );

        if (!payload || !payload.sub) {
          console.log(
            '[WS-ADAPTER] ❌ Invalid token payload',
          );
          return next(new Error('Invalid token'));
        }

        // Attach user info to socket
        (socket as any).user = {
          id: payload.sub,
          username: payload.username,
          email: payload.email,
          isSuperUser: payload.isSuperUser,
        };

        console.log(
          `[WS-ADAPTER] ✅ Authenticated user ${payload.sub} (${payload.username})`,
        );
        next();
      } catch (error) {
        console.log(
          '[WS-ADAPTER] ❌ Authentication error:',
          error.message,
        );
        console.log(
          '[WS-ADAPTER] Error stack:',
          error.stack,
        );
        return next(
          new Error('Invalid or expired token'),
        );
      }
    });

    console.log(
      '[WS-ADAPTER] ✅ Middleware registered successfully',
    );
    return server;
  }
}
