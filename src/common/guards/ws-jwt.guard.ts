import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const client: Socket = context
        .switchToWs()
        .getClient();

      console.log(
        '[WS-GUARD] Authenticating WebSocket connection...',
      );

      const token = this.extractToken(client);

      if (!token) {
        console.log(
          '[WS-GUARD] ❌ No token provided',
        );
        throw new WsException(
          'Authentication token required',
        );
      }

      console.log(
        '[WS-GUARD] Token found, verifying...',
      );

      const jwtSecret =
        this.configService.get<string>(
          'security.jwtSecret',
        );
      const payload = this.jwtService.verify(
        token,
        { secret: jwtSecret },
      );

      if (!payload || !payload.sub) {
        console.log(
          '[WS-GUARD] ❌ Invalid token payload',
        );
        throw new WsException('Invalid token');
      }

      // Attach user to socket
      (client as any).user = {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        isSuperUser: payload.isSuperUser,
      };

      console.log(
        `[WS-GUARD] ✅ Authenticated user ${payload.sub} (${payload.username})`,
      );
      return true;
    } catch (error) {
      console.log(
        '[WS-GUARD] ❌ Authentication failed:',
        error.message,
      );
      throw new WsException(
        'Authentication failed',
      );
    }
  }

  private extractToken(
    client: Socket,
  ): string | null {
    const authHeader =
      client.handshake.headers.authorization;
    const authToken =
      client.handshake.auth?.token;

    let token = authToken || authHeader;

    if (token && token.startsWith('Bearer ')) {
      token = token.substring(7);
    }

    return token || null;
  }
}
