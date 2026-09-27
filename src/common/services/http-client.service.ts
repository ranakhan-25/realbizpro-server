import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { AxiosError } from 'axios';
import { QueryTypes, Sequelize } from 'sequelize';
import { firstValueFrom } from 'rxjs';
import { ErrorHandlerHelper } from '../helper/errorMessage.helper';

@Injectable()
export class HttpClientService {
  constructor(
    private readonly http: HttpService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  // Resolve bearer token: explicit value takes priority;
  // if only userId is provided, fetch the latest valid token from DB.
  private async resolveToken(
    bearerToken?: string,
    userId?: number,
  ): Promise<string | undefined> {
    if (bearerToken) return bearerToken;
    if (!userId) return undefined;

    const rows = await this.sequelize.query<{
      token: string;
    }>(
      `SELECT token FROM sys_user_tokens
       WHERE user_id = :userId
         AND expires_at > NOW()
         AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );

    return rows.length > 0
      ? `Bearer ${rows[0].token}`
      : undefined;
  }

  // universal request handler
  private async request(
    method:
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'PATCH'
      | 'DELETE',
    url: string,
    payload?: any,
    _isForm: boolean = false,
    bearerToken?: string,
    userId?: number,
  ): Promise<any> {
    const resolvedToken = await this.resolveToken(
      bearerToken,
      userId,
    );

    const data = payload;
    const headers = resolvedToken
      ? { Authorization: resolvedToken }
      : {};

    try {
      const response = await firstValueFrom(
        this.http.request({
          method,
          url,
          data,
          headers:
            Object.keys(headers).length > 0
              ? headers
              : undefined,
        }),
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const statusCode =
          error.response?.status ??
          HttpStatus.INTERNAL_SERVER_ERROR;
        const responseData = error.response
          ?.data as
          | Record<string, unknown>
          | undefined;
        const message =
          typeof responseData?.message ===
          'string'
            ? responseData.message
            : error.message;

        throw new HttpException(
          {
            ...(responseData ?? {}),
            message,
            statusCode,
          },
          statusCode,
        );
      }

      ErrorHandlerHelper.handleError(error);
    }
  }

  // --- SHORTCUT METHODS ---
  get(
    url: string,
    bearerToken?: string,
    userId?: number,
  ) {
    return this.request(
      'GET',
      url,
      undefined,
      false,
      bearerToken,
      userId,
    );
  }

  post(
    url: string,
    payload: any,
    userId?: number,
    bearerToken?: string,
  ) {
    return this.request(
      'POST',
      url,
      payload,
      false,
      bearerToken,
      userId,
    );
  }
}
