import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtHybridAuthGuard extends AuthGuard(
  ['jwt', 'mobile-jwt'],
) {
  override handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Invalid or expired authentication token',
        )
      );
    }
    return user;
  }
}
