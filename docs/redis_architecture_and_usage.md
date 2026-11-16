# Redis Architecture & Usage Guide in RealBiz Pro

**Document Date:** November 16, 2026  
**System:** RealBiz Pro Enterprise Backend & Frontend Architecture  
**Repositories:**  
- Backend: [`realbiz_pro_server`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server) (NestJS, Sequelize ORM, PostgreSQL, Redis)  
- Frontend: [`realbiz_pro`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro) (Next.js 16.3.4, React 19, Tailwind CSS)  

---

## 1. Executive Overview

Redis (Remote Dictionary Server) operates as a central in-memory data store, cache layer, and asynchronous message broker within the RealBiz Pro enterprise architecture.

By offloading ephemeral session state, high-frequency security authorizations, and asynchronous task queues to Redis memory, the system achieves:
1. Sub-millisecond response times for repetitive API requests and permission evaluations.
2. Robust token security through immediate JSON Web Token (JWT) revocation and refresh token lifecycle management.
3. Decoupled multi-company session context for multi-tenant users without database writes.
4. Highly resilient background queue processing for biometric attendance and batch operations.

---

## 2. Redis Configuration & Connection Lifecycle

The Redis connection layer is managed globally by the [`RedisModule`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/database/redis.module.ts) and [`RedisService`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/database/redis.service.ts).

### Connection Architecture
The service utilizes `ioredis` and initializes three distinct client connections:
- **Main Client (`this.client`):** Handles all standard key-value, string, hash, set, list, and JSON operations.
- **Subscriber Client (`this.subscriber`):** Dedicated exclusively to Redis event subscriptions.
- **Publisher Client (`this.publisher`):** Dedicated exclusively to message publishing across channels.

```typescript
// src/database/redis.service.ts
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }
}
```

---

## 3. The 7 Core Architectural Use Cases

### 3.1 Authentication Security: JWT Blacklisting & Refresh Token Lifecycle
Stateless JWT tokens normally remain valid until their expiration timestamp passes. To allow immediate user logout, password resets, or forced account suspensions, RealBiz Pro enforces Redis-based token management:

1. **JWT Token Blacklisting (`auth:blacklist:<jti>`):**
   - When a user logs out in [`AuthService.logout`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/user-management/auth/auth.service.ts), the unique JWT ID (`jti`) is extracted from the payload.
   - The token ID is stored in Redis with a TTL exactly matching the remaining validity of the token:
     ```typescript
     const ttl = decoded.exp - Math.floor(Date.now() / 1000);
     if (ttl > 0) {
       await this.cacheService.set(this.getBlacklistKey(decoded.jti), 'blacklisted', { ttl, prefix: 'auth' });
     }
     ```
   - On incoming requests, authentication guards check Redis to verify that the token has not been blacklisted.
2. **Refresh Token Verification (`auth:refresh_token:<userId>`):**
   - Refresh tokens are generated as 32-byte cryptographically secure random hex strings and stored in Redis under the user key.
   - When rotating or refreshing tokens, Redis validates the token. On logout or password change, the key is evicted immediately, invalidating open sessions across all devices.

---

### 3.2 High-Performance RBAC & Permission Caching
Every protected API route in RealBiz Pro verifies granular permissions (such as `credit-realization:read`, `credit-realization:write`, or `accounts:read`).

Querying PostgreSQL tables (`sys_users`, `sys_user_roles`, `sys_roles`, `sys_role_permissions`, `sys_permissions`) on every single HTTP request would create severe database bottlenecks.

1. **In-Memory Permission Resolution:**
   - In [`UsersService`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/engine/user-management/users/users.service.ts), resolved user details and permission keys are cached in Redis:
     - `user:basic:v5:<id>` (User basic profile and organization context)
     - `user:v2:<id>` (Full authenticated user record)
     - `user:<id>:permissions` (Resolved permission string arrays)
   - Cached records have a default TTL of 300 seconds (5 minutes).
2. **Instant Cache Eviction:**
   - Whenever an administrator modifies user roles, changes permissions, or deletes an account, [`UsersService`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/user-management/users/users.service.ts) triggers explicit invalidation:
     ```typescript
     await this.redisService.del(`user:${user.uuid}:permissions`);
     await this.redisService.del(`user:${user.id}:permissions`);
     ```
   - This ensures permission changes propagate instantly across the platform.

---

### 3.3 Multi-Company Context & Active Session Switching
RealBiz Pro supports multi-tenant enterprise holding structures where a single user may hold assignments across multiple subsidiary companies:

1. **Company Selection Storage:**
   - When a user selects their active working company via `POST /company/select`, [`CompanyService`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/company/company.service.ts) stores the selection in Redis:
     ```typescript
     const redisKey = `user:${user.id}:selected_company`;
     await this.redisService.set(redisKey, companyId.toString());
     ```
2. **Endpoint Validation via Guard:**
   - The [`CompanyGuard`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/common/guards/company.guard.ts) intercepts requests to company-scoped resources, extracts the active `selected_company` ID directly from Redis, and validates that the company is active.
   - This architecture allows instant company context switching without requiring database mutations or generating fresh JWTs upon each workspace toggle.

---

### 3.4 HTTP Route & Response Caching (`CacheInterceptor`)
Expensive, read-heavy API responses are cached at the controller level using Redis:

1. **Decorator-Driven Caching:**
   - Endpoints are decorated with `@CacheKey(...)` and `@CacheTTL(...)`.
2. **Pipeline Interception:**
   - The [`CacheInterceptor`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/common/interceptors/cache.interceptor.ts) inspects Redis through [`CacheService`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/common/services/cache.service.ts).
   - On a cache hit, the cached JSON payload is returned immediately without executing the controller method or database queries.
   - On a cache miss, the handler executes, and the resulting payload is written into Redis asynchronously.

---

### 3.5 Asynchronous Task & Job Queues (Bull & BullBoard Dashboard)
RealBiz Pro uses Redis as the backing store for asynchronous distributed queues:

1. **Bull Queue Engine:**
   - Background tasks like biometric attendance processing (ZKTeco device synchronization), scheduled email/SMS notifications, and batch reconciliation run through `@nestjs/bull`.
   - Redis queues handle job scheduling, concurrency management, and automatic retry policies.
2. **Visual Queue Dashboard:**
   - Integrated via [`BullBoardService`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/engine/queue-dashboard/bull-board.service.ts) at `http://localhost:5002/admin/queues`.
   - Administrators can monitor live job progress, inspect failed jobs, and re-trigger queue workers directly in real-time.

---

### 3.6 Pub/Sub (Publish/Subscribe) Event Messaging Architecture
The [`RedisService`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/database/redis.service.ts) provides native Pub/Sub capabilities:

- **Methods:** `publish(channel, message)`, `publishJson(channel, data)`, `subscribe(channel, callback)`, and `unsubscribe(channel)`.
- **Use Case:** When scaling across multiple load-balanced Node.js server processes, Redis Pub/Sub acts as a cross-process communication bus. Events like WebSocket push notifications, system-wide alerts, or cache invalidation broadcasts are published to Redis channels and delivered to all listening application workers.

---

### 3.7 Real-Time System Health Monitoring & Heartbeat Probes
System health and orchestration liveness probes monitor Redis availability:

- **Health Endpoint:** `GET /realbizpro/api/v1/health` implemented in [`HealthController`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/health/health.controller.ts).
- **Liveness Verification:** Executes `await this.redisService.ping()` alongside PostgreSQL connection checks.
- If Redis becomes unreachable, the health probe reports an error status, alerting infrastructure monitoring tools or container orchestrators (e.g. Kubernetes, PM2, Docker Compose) to take automated recovery action.

---

## 4. Key Schema & Memory Management Conventions

| Key Pattern | Data Type | Default TTL | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `auth:blacklist:<jti>` | String | Token Exp (variable) | Revoked JWT blacklist check on API requests |
| `auth:refresh_token:<userId>` | String | 7 days / Refresh Exp | Validating refresh token rotation |
| `user:basic:v5:<userId>` | JSON String | 300 seconds (5 min) | Cached user profile and active organization data |
| `user:v2:<userId>` | JSON String | 300 seconds (5 min) | Authenticated user payload for internal engine services |
| `user:<userId>:permissions` | JSON String | 300 seconds (5 min) | Pre-computed user permission string arrays |
| `user:<userId>:selected_company` | String (Integer) | Persistent (No TTL) | Active company session selection for multi-company users |
| `<controller_prefix>:<cacheKey>` | JSON String | Configurable (e.g. 60 to 3600s) | HTTP route response cache via `CacheInterceptor` |
| `bull:attendance:*` | Hash / Set / ZSet | Managed by Bull | Bull queue job records and attendance schedule state |

---

## 5. Source Code File Reference

- Redis Core Service: [`src/database/redis.service.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/database/redis.service.ts)
- Redis Module Definition: [`src/database/redis.module.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/database/redis.module.ts)
- Cache Interceptor: [`src/common/interceptors/cache.interceptor.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/common/interceptors/cache.interceptor.ts)
- Cache Service: [`src/common/services/cache.service.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/common/services/cache.service.ts)
- Permissions Guard: [`src/common/guards/permissions.guard.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/common/guards/permissions.guard.ts)
- Company Guard: [`src/common/guards/company.guard.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/common/guards/company.guard.ts)
- Auth Service: [`src/modules/user-management/auth/auth.service.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/user-management/auth/auth.service.ts)
- Users Service: [`src/modules/user-management/users/users.service.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/user-management/users/users.service.ts)
- Company Service: [`src/modules/company/company.service.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/company/company.service.ts)
- Queue Dashboard Service: [`src/modules/engine/queue-dashboard/bull-board.service.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/engine/queue-dashboard/bull-board.service.ts)
- Health Controller: [`src/modules/health/health.controller.ts`](file:///home/sakib/Desktop/Projects%20Old/realbiz/realbiz_pro_server/src/modules/health/health.controller.ts)
