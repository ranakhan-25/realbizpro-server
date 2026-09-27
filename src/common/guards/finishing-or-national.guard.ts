import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthUser } from '../types/jwt-user.type';

@Injectable()
export class FinishingOrNationalGuard implements CanActivate {
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
      user.userType === 'Factory' ||
      user.userType === 'National';
    if (!isAllowed) {
      throw new ForbiddenException(
        'Only factory and national users can view delivery summary',
      );
    }

    // Attach resolved sectionIds to request for later use
    if (user.userType === 'Factory') {
      request.sectionIds = user.sections.map(
        (section) => Number(section.id),
      );
    }

    // Attach resolved unitIds to request for later use
    if (user.userType === 'Factory') {
      request.unitId = user.unitId;
    }

    // For national, distributionIds will be taken from query param later (or validated)
    return true;
  }
}
