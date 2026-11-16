import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { runWithShareUserTenant } from '../context/share-user-tenant.context';

@Injectable()
export class ShareUserTenantInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request?.user;

    if (
      user?.authType === 'share-user' &&
      user?.email
    ) {
      const store = {
        authType: 'share-user' as const,
        shareUserId: Number(user.shareUserId ?? user.id),
        email: String(user.email).trim().toLowerCase(),
        orgId: user.orgId ? Number(user.orgId) : 0,
      };

      return new Observable((subscriber) => {
        const subscription = runWithShareUserTenant(store, () =>
          next.handle().subscribe(subscriber),
        );
        return () => subscription.unsubscribe();
      });
    }

    return next.handle();
  }
}
