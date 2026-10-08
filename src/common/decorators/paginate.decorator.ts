import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export interface PaginateParams {
  page: number;
  limit: number;
  skip: number;
  search?: string;
}

export interface PaginateResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const Paginate = createParamDecorator(
  (
    options: {
      limit?: number;
      maxLimit?: number;
    } = {},
    ctx: ExecutionContext,
  ): PaginateParams => {
    const { query } = ctx
      .switchToHttp()
      .getRequest();

    const page = Math.max(
      1,
      parseInt(query.page) || 1,
    );
    const limit = Math.min(
      options.maxLimit || 100,
      Math.max(
        1,
        parseInt(query.limit) ||
          options.limit ||
          10,
      ),
    );
    const skip = (page - 1) * limit;
    const search =
      query.search?.trim() || undefined;

    return { page, limit, skip, search };
  },
);
