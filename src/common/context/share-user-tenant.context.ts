import { AsyncLocalStorage } from 'async_hooks';

export interface ShareUserTenantContext {
  authType: 'share-user';
  shareUserId: number;
  email: string;
  orgId: number;
}

const shareUserTenantStorage = new AsyncLocalStorage<ShareUserTenantContext>();

export function runWithShareUserTenant<T>(
  ctx: ShareUserTenantContext,
  fn: () => T,
): T {
  return shareUserTenantStorage.run(ctx, fn);
}

export function getShareUserTenant(): ShareUserTenantContext | undefined {
  return shareUserTenantStorage.getStore();
}
