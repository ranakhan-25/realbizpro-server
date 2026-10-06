import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Op } from 'sequelize';

@Injectable()
export class OfficeAccessScopeService {
  constructor() {}

  private extractUserId(
    user: any,
  ): number | null {
    if (!user) return null;
    const rawId =
      user.id ??
      user._id ??
      user.userId ??
      user.sub ??
      user.employeeId ??
      user.user?.id;
    const num = Number(rawId);
    return Number.isFinite(num) && num > 0
      ? num
      : null;
  }

  async getOfficeScope(user: any): Promise<{
    isNational: boolean;
    officeIds: number[];
  }> {
    return {
      isNational: true,
      officeIds: [],
    };
  }

  async getOfficeTypeScope(user: any): Promise<{
    isNational: boolean;
    officeTypeIds: number[];
  }> {
    return {
      isNational: true,
      officeTypeIds: [],
    };
  }

  async applyToQuery<
    T extends Record<string, any>,
  >(query: T, user: any): Promise<T> {
    return {
      ...query,
      __isNational: true,
      officeIds: Array.isArray(
        (query as any).officeIds,
      )
        ? [...new Set((query as any).officeIds)]
        : (query as any).officeIds,
    };
  }

  buildWhereByOfficeScope(scope: {
    isNational: boolean;
    officeIds: number[];
  }) {
    if (scope.isNational) {
      return {};
    }

    return {
      officeId: {
        [Op.in]: scope.officeIds,
      },
    };
  }

  async getShowroomScope(user: any): Promise<{
    isNational: boolean;
    showroomIds: number[];
  }> {
    return {
      isNational: true,
      showroomIds: [],
    };
  }
}
