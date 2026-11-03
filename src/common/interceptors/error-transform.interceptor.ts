import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorTransformInterceptor implements NestInterceptor {
  constructor() {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest();

    return next.handle().pipe(
      catchError((error) => {
        let statusCode: number;
        let message: string;
        let errors: any;

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          const errorResponse =
            error.getResponse() as any;

          if (
            error instanceof
              BadRequestException &&
            errorResponse.errors
          ) {
            // Handle specific validation errors from class-validator
            message = errorResponse.message;
            errors = errorResponse.errors;
          } else {
            // Handle other HTTP exceptions
            message =
              typeof errorResponse === 'string'
                ? errorResponse
                : errorResponse.message ||
                  error.message;
          }
        } else if (
          error instanceof
          SequelizeValidationError
        ) {
          statusCode = HttpStatus.BAD_REQUEST;
          const detailedItems = (error.errors || []).map(
            (item: any) => ({
              field: item.path,
              message: item.message,
              value: item.value,
            }),
          );
          errors = detailedItems;
          const reasons = detailedItems
            .map((item: any) => {
              const valStr =
                item.value !== undefined && item.value !== null
                  ? ` ("${item.value}")`
                  : '';
              return item.field &&
                !item.message
                  ?.toLowerCase()
                  .includes(item.field.toLowerCase())
                ? `${item.field}: ${item.message}${valStr}`
                : `${item.message}${valStr}`;
            })
            .filter(Boolean);
          message =
            reasons.length > 0
              ? reasons.join('; ')
              : error.message || 'Validation error';
        } else {
          // Handle non-HTTP, unexpected errors
          statusCode =
            HttpStatus.INTERNAL_SERVER_ERROR;
          message =
            error.message ||
            'Internal server error';
        }

        const responseBody = {
          success: false,
          message,
          ...(errors && { errors }), // Conditionally add validation errors
          timestamp: new Date().toISOString(),
          path: request.url,
          statusCode,
        };

        // Log the error regardless of type
        console.error(
          `Error ${statusCode} on ${request.method} ${request.url}`,
          {
            ...responseBody,
            stack: error.stack,
            user:
              request.user?.email || 'Anonymous',
          },
        );

        // **Send email ONLY for 500 errors**
        // if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
        //   this.sendErrorEmail(error, request, responseBody).catch(
        //     (emailError) => {
        //       console.error('Failed to send error email:', emailError);
        //     },
        //   );
        // }

        // Always throw a standard HttpException for the client
        return throwError(
          () =>
            new HttpException(
              responseBody,
              statusCode,
            ),
        );
      }),
    );
  }

  private async sendErrorEmail(
    error: any,
    request: any,
    response: any,
  ) {
    try {
      const adminEmails =
        process.env.ADMIN_EMAILS?.split(',') || [
          'admin@example.com',
        ];

      // await this.emailService.sendMail({
      //   to: adminEmails,
      //   subject: `🚨 500 Error Alert - ${process.env.APP_NAME || 'RealBiz Pro API'}`,
      //   template: 'error-notification',
      //   context: {
      //     errorMessage: error.message,
      //     errorStack: error.stack,
      //     timestamp: response.timestamp,
      //     path: response.path, // Use the path from the response object
      //     method: request.method, // <-- ADD THIS LINE
      //     userAgent: request.headers['user-agent'],
      //     userEmail: request.user?.email || 'Anonymous',
      //     userId: request.user?.id || 'N/A',
      //     ip: request.ip,
      //     body: JSON.stringify(request.body, null, 2),
      //     query: JSON.stringify(request.query, null, 2),
      //     headers: JSON.stringify(request.headers, null, 2),
      //   },
      // });

      console.log(
        'Error email sent successfully.',
      );
    } catch (emailError) {
      console.error(
        'Email service failed to send error report:',
        emailError,
      );
    }
  }
}
