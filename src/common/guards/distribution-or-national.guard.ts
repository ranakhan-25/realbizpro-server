import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthUser } from '../types/jwt-user.type';

@Injectable()
export class DistributionOrNationalGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context
      .switchToHttp()
      .getRequest();
    const user = request.user as JwtAuthUser;

    if (!user?.id) {
      throw new ForbiddenException(
        'Invalid user information',
      );
    }

    const isAllowed =
      user.userType === 'Distribution' ||
      user.userType === 'National';

    if (!isAllowed) {
      throw new ForbiddenException(
        'Only distribution and national users can view delivery summary',
      );
    }

    // Attach resolved distributionIds to request for later use
    if (user.userType === 'Distribution') {
      request.distributionIds = [
        Number(user.distributionId),
      ];
    }
    // For national, distributionIds will be taken from query param later (or validated)
    return true;
  }
}
