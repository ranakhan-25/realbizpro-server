# RealBiz Pro: multi-tenant RBAC + page-access design

> Status (2026-10-19): approved as a design only. No code changed. Decisions are recorded in `~/.claude/handoffs/realbiz_pro_server-handoff.md`. The next build step, when you ask for it, is Phase 0.

## Context
You asked me to check your reading of the two requirement docs (they are `.docx`, not PDF). You also asked how to design multi-tenant RBAC with page/route access in NestJS + Next.js: Redis caching and its risks, pivot tables, page naming, tenant data isolation, indexes and new table fields.

The current backend is not ready for this:
- 545 of 665 routes have no auth.
- There is no `organization_id` on business tables.
- Permissions are flat keys copied from roles to users, and the assign-role endpoint skips that copy.
- The seeded catalogue is from a garment ERP.
- The code supports a user being in several companies, chosen per session through Redis (`company.guard.ts`).

## Decisions (confirmed by you)
- **Organization owns many companies.**
  - `organization_id` is the tenant boundary: it goes in the JWT, the ORM hooks and RLS.
  - `company_id` is a sister concern inside the org. It is selected per session, checked against `sys_user_company`, and stored in CLS next to the org.
  - Company-scoped tables carry both columns, with a composite FK `(organization_id, company_id)`.
- **SA reaches tenant data only through audited impersonation.** SA starts a short "act as org" session: it is logged in `sys_audit_logs`, shows a banner, and expires.
- **This pass is plan only.** No code changes. Phase 0 is the recommended first build when you're ready.

## 1. Is your reading of the docs right?

**What the docs actually say:**
- **SA** (Super Admin) creates organizations (01.01). SA also manages subscriptions: plans, modules and feature limits (01.02).
- **SA/OA** (OA = Organization Admin) manage users, roles and permissions (01.03). SA/OA control "module, feature, action and project-level access" (01.04).
- **Multi-tenancy:** an `organization_id` on tenant tables (31.02). Authorization is by module, feature, action and scope, through an auth guard plus RBAC middleware (31.03).
- **Security layer (31):** UUID public IDs, refresh-token rotation, soft delete, audit trail, and tenant/project/date indexes (33.05).

**What is your design, not the docs'** (good choices, but none of this is written down):
- org info carried in the JWT
- a Redis cache of access rights
- a tree picker for OA
- auto-copying company details into new users

**Corrections:**
1. **Access is per action, not only per page.** The docs say *action-level* permissions. A page is just a UI view of several API actions (list, create, approve and so on). Hiding a page in Next.js is cosmetic. The NestJS guard on each API action is the real control. So the tree should have pages as nodes with actions as leaves, e.g. "Leads page → view / create / edit / delete / export".
2. **SA should get modules as a subscription, not hand-picked ticks per org.** 01.02 describes plans, modules and limits. SA picks a plan (a bundle of modules and sub-modules) and can switch individual modules on or off per org. Under the hood this is still "SA chooses what OA can reach". It is the ceiling for everything below it.
3. **OA can only grant what OA itself has** (no privilege escalation). The effective rights of any user are:
   `(role permissions ∪ direct grants) ∩ org entitlements (from SA)`.
   If SA later removes a module, every user in that org loses it at once, with no cleanup job.
4. **SA "access to all pages" means platform pages.** That covers orgs, plans, modules and audit. SA should not read tenant business data by default. Support access should go through an explicit, audited "impersonate org" mode with a visible banner. This is standard SaaS practice and protects you legally.
5. **The new user's company is set on the server, never sent by the browser.** When OA creates a user, `organization_id` comes from OA's verified token. The DTO must not accept `organization_id` at all (stripped by `whitelist`).
6. **Do not put the permission list in the JWT.** JWT payloads are only base64, so anyone holding the token can read them. Permission lists also grow large and go stale. The JWT carries only `sub`, `org` (org uuid), `sid` (session id) and `pv` (permission version). Everything else is loaded server-side and cached.

## 2. Redis: is caching user info safe?
Redis is safe if it is never reachable from outside and holds no secrets. The real-world leaks come from exposed instances: thousands found open on the internet, data read, ransomware, even RCE through `CONFIG`.

**Rules:**
- **Network:** bind only to a private interface or a Docker network, keep `protected-mode yes`, and firewall port 6379 to the app hosts only. Never `bind 0.0.0.0` with no password.
- **Auth:** use Redis 6+ ACL users, one per service, limited to key patterns (`~rbz:*`) and with `-@dangerous` (no `CONFIG`, `FLUSHALL`, `KEYS`, `DEBUG`). Use TLS if Redis is on another host.
- **What to store:** permission keys, entitlement version, session id → user id, org id, status. **Never** passwords, password hashes, refresh tokens in plain text, or unnecessary personal data such as NID or phone. Hash refresh tokens even in the DB.
- **Keys:** namespace and scope per org, e.g. `rbz:perm:{orgId}:{userId}:v{pv}`, with a TTL of 15–60 min.
- **Cache, not source of truth:** Postgres stays the source of truth. If Redis is down, fall back to the DB. **Never fail open.**
- **Invalidation:** any role, grant or entitlement change bumps `perm_version` in the DB, deletes the keys and pushes a websocket event. The Next.js menu then refreshes "in real time" (you already have ws plus a JWT guard).
- **Revocation:** `sid` in Redis is a session allow-list. Logout or deactivation deletes it, and the next request fails even though the JWT has not expired. The app already has a blacklist plus a DB token check (`jwt.strategy.ts`); consolidate both into this.

## 3. Storing page/route access: pivot tables
Yes, use normalized pivot tables. This is the standard enterprise RBAC shape (NIST RBAC: users ↔ roles ↔ permissions). It scales and keeps audit simple. Replace the current "copy role perms into user rows" approach: it is what caused the assign-role bug. Compute the effective set at read time and cache it.

**Global catalogue** (owned by SA, seeded from code, no `organization_id`):
- `sys_resources` (one self-referencing tree)
  - Columns: `id, uuid, parent_id, type ENUM('module','sub_module','section','page'), code, name, route_path, icon, sort_order, is_active`
  - Plus `path` (materialized path, e.g. `crm.leads.pipeline`) for fast subtree queries.
- `sys_actions`: `view, list, create, update, delete, approve, export, print`, plus custom ones.
- `sys_permissions`: `resource_id + action_id` with `key UNIQUE` (e.g. `crm.leads.pipeline:create`).
- `sys_plans` + `sys_plan_resources`: the SA bundles.

**Per org** (all carry `organization_id`):
- `sys_organizations`: the tenant.
- `sys_org_entitlements(organization_id, resource_id)`: what SA enabled, defaulting from the plan, overridable.
- `sys_roles(organization_id NULL = system template)`, `sys_role_permissions(role_id, permission_id)`.
- `sys_user_roles(user_id, role_id, organization_id, scope_type NULL|'project'|'company', scope_id NULL)`. Scope gives the docs' "project-level access".
- `sys_user_permissions(user_id, permission_id, organization_id, effect ENUM('allow','deny'))`: optional overrides, kept small.
- `sys_audit_logs`: who changed which grant.

The OA tree UI is one query: entitlement subtree joined with permissions, filtered to permissions OA holds.

## 4. Naming (module → sub-module → section → page → action)
- **Codes** are lowercase snake/kebab, ASCII, never renamed and never reused. Display names are separate (and can be translated).
- **Key:** `<module>.<sub_module>.<section>.<page>:<action>`. Skip levels that don't exist, but keep the order fixed.
  - `projects.requisition.material.list:view`
  - `projects.requisition.material.list:approve`
  - `crm.leads.pipeline:update`
  - `hrm.payroll.salary_sheet:export`
  - `platform.organizations:create` (SA only, its own `platform` module)
- **Routes match the tree:**
  - Next.js: `app/(app)/projects/requisition/material/page.tsx`
  - API: `/api/v1/projects/requisitions/material`
  - `route_path` is stored on the resource, so the menu is generated from data, never hard-coded.
- One `permissions.ts` constants file (generated from the seed) is used by both backend decorators and the frontend, so there are no string typos.
- Module codes for this repo: `platform, settings, lams, projects, construction, crm, marketing, sales, collection (cr), procurement, inventory, accounts, billing, assets, hrm, legal, service, handover, broker, dms, workflow, notification, reports`. These follow the docs' 34-module list.

## 5. Tenant data isolation (shared tables, no leaks)
Use defence in depth. Each layer catches what the one before misses.
1. **Identity from the token only.** `organization_id` is never taken from a body, query or header. A global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` rejects it.
2. **Request context.** A `TenantGuard` resolves the org from the JWT, checks the org is active and its subscription valid, and stores it in `nestjs-cls` (AsyncLocalStorage).
3. **ORM auto-scoping.** Sequelize global hooks (`beforeFind`, `beforeCount`, `beforeCreate`, `beforeBulkCreate`, `beforeUpdate`, `beforeBulkUpdate`, `beforeDestroy`, `beforeBulkDestroy`) read CLS:
   - add `where organization_id = :org` to reads and writes;
   - set it on creates;
   - throw if the context is missing on a tenant model.
   - nestjs-cls has no official Sequelize adapter, so this is custom code (about 80 lines).
4. **Postgres Row-Level Security as the safety net.** This also covers the raw `sequelize.query` SQL the repo already uses (`users.service.ts`).
   - Per table: `ENABLE` + `FORCE ROW LEVEL SECURITY`, with a `RESTRICTIVE` policy `USING/WITH CHECK (organization_id = current_setting('app.org_id')::bigint)`.
   - The app sets `SET LOCAL app.org_id` inside each request transaction. Use `SET LOCAL`, never `SET`, because of pooling.
   - The app's DB role must not be a superuser, must not have `BYPASSRLS`, and should not own the tables. Migrations run as a separate owner role.
5. **Cross-tenant reference checks.** Children link to parents through composite FKs, e.g. `(organization_id, project_id) → projects(organization_id, id)`. This makes it impossible to attach Org B's project to Org A's requisition. Where there is no FK (polymorphic), validate it in the service.
6. **IDOR (guessable-ID access):** use public `uuid`s in URLs (BaseModel already has `uuid`). For another org's record, always return **404, not 403**, so its existence isn't revealed.
7. **Uniqueness per tenant:** `UNIQUE(organization_id, code)`, and invoice/voucher number sequences per org.
8. **Other channels:**
   - BullMQ jobs carry `orgId` explicitly and set CLS before running.
   - Websocket rooms are `org:{id}`.
   - S3 keys are prefixed `org/{uuid}/…` with short-lived signed URLs.
   - Redis keys include the org.
   - Exports and reports go through the same scoped services.
9. **Tests:** a CI e2e suite where user A in Org 1 tries every route against Org 2 data and expects 404/403.

## 6. Indexes ("non-clustered")
Postgres has no clustered indexes that it keeps up to date: every B-tree index works like SQL Server's "non-clustered". So the answer is yes, add B-tree indexes:
- **Composite, `organization_id` first,** matching the common filters:
  - `(organization_id, status, created_at DESC)`
  - `(organization_id, project_id)`
  - `(organization_id, lead_stage_id)`
- **Partial indexes for soft delete** (all models are `paranoid`): `... WHERE deleted_at IS NULL`.
- **Index every FK column.** Postgres does not do this automatically.
- **Unique:** `uuid` globally; business codes per org.
- Create them with `CREATE INDEX CONCURRENTLY` in migrations on live data.
- Measure with `EXPLAIN ANALYZE` and `pg_stat_statements` before adding more. Every index slows writes.
- Partitioning by org is not needed at this size.

## 7. Fields to add or clean up
- **Every tenant table:**
  - `organization_id BIGINT NOT NULL` (FK, indexed)
  - `company_id` where sister-concern scoping is needed
  - `created_by`, `updated_by`, `deleted_by`
  - `version INT` (Sequelize `version: true`, optimistic locking for approvals and stock)
  - `uuid`, timestamps and `deleted_at` already exist in `src/database/base.model.ts`.
- **`sys_users`:**
  - Add: `organization_id NULL` (NULL only for platform users), `user_scope ENUM('platform','tenant')` replacing `isSuperUser`, `perm_version`, `password_changed_at`, `failed_login_count`, `locked_until`, `mfa_secret_enc`, `invited_by`.
  - Drop the garment leftovers (`distributionId`, `warehouseId`, `factoryId`, `receivingPointId`, showroom `userType` values) after checking usage.
- **`sys_organizations`:** `uuid, name, slug, legal_name, trade_license, tin/bin, address, logo_file_id, status, plan_id, subscription_start/end, limits JSONB, settings JSONB`.
- **`sys_audit_logs`:** `organization_id, actor_id, action, entity, entity_id, before JSONB, after JSONB, ip, user_agent, request_id, created_at`. Insert-only, with a monthly partition later.

## 8. NestJS request pipeline (order matters)
1. **Middleware:** `helmet`, request-id, cookie-parser. Rate limiting is already there (`ThrottlerGuard`).
2. **Global `APP_GUARD`s, in order:**
   1. `JwtAuthGuard` (deny by default, `@Public()` to opt out). This alone closes the 545 open routes.
   2. `TenantGuard`
   3. `EntitlementGuard` (is this module enabled for the org?)
   4. `PermissionsGuard` (`@RequirePermission('crm.leads.pipeline:update')`)
3. **Startup check:** every route has `@Public()`, `@AuthOnly()` or `@RequirePermission()`, otherwise the app refuses to boot. This is real deny-by-default.
4. **Interceptors:** `TenantTransactionInterceptor` (opens the transaction and runs `SET LOCAL app.org_id`), `AuditInterceptor` (mutations), the response envelope, and logging (already exists).
5. **Pipes:** the global `ValidationPipe` as above.
6. **Filters:** one exception filter that maps tenant misses to 404 and hides stack traces.
7. **Reuse and fix:**
   - `src/common/guards/permissions.guard.ts`: keep the structure and swap the lookup for the cached effective set.
   - `src/common/decorators/permissions.decorator.ts`, `public.decorator.ts`.
   - `src/common/strategies/jwt.strategy.ts`.
   - `src/common/services/cache.service.ts`.
   - Retire `company.guard.ts` into `TenantGuard`.

## 9. Next.js side (UX only, never the security boundary)
- Tokens go in `httpOnly`, `Secure`, `SameSite=Lax` cookies, never `localStorage`.
- **`proxy.ts`** (Next 16 renamed `middleware.ts`) does the cheap redirect when not logged in.
- **Do not rely on it for authz.** CVE-2025-29927 let attackers skip middleware with a spoofed `x-middleware-subrequest` header.
- Server Components / layout call `GET /api/v1/me/access` and get the menu tree plus permission keys. Pages check access server-side and `notFound()` when access is missing.
- A `<Can perm="…">` component hides buttons.
- A websocket `perm-changed` event refreshes the menu.

## 10. Rollout for this repo (phased, each phase shippable)
- **Phase 0 (urgent, small):** make `JwtAuthGuard` + `PermissionsGuard` global in `src/app.module.ts`. Mark health/login/face-auth routes `@Public()`. Fix `assignRole` in `src/modules/user-management/users/users.service.ts` (or remove the copy model in Phase 3).
- **Phase 1:**
  - Add `sys_organizations`.
  - Migration: add `organization_id` nullable → backfill a default org → `NOT NULL` → indexes `CONCURRENTLY`. Order: `sys_*` user tables first, then module by module (crm, cr, lams, projects, inventory, hrm).
- **Phase 2:** nestjs-cls + `TenantGuard` + Sequelize scoping hooks. Add the cross-tenant e2e tests.
- **Phase 3:**
  - New resource tree, permission and entitlement tables.
  - Rewrite the seed: drop the garment catalogue and generate from the docs' module list plus `scripts/sync-permissions.js`.
  - Effective-permission service with Redis caching and versioning.
  - `/me/access` endpoint.
- **Phase 4:** RLS policies plus a separate DB owner role for migrations. Add `TenantTransactionInterceptor`.
- **Phase 5:** Next.js tree picker for OA, menu generated from data, audit-log viewer, SA impersonation.

## Verification
- Phase 0: `curl` an unguarded route (e.g. `DELETE /project/:uuid`) with no token → 401. `pnpm test` and the e2e tests pass.
- Startup route audit: the app refuses to boot when a route has no access decorator.
- Cross-tenant e2e suite: Org 1 user against Org 2 UUIDs on every route → 404.
- RLS check: in `psql` as the app role, select without `SET LOCAL app.org_id` → 0 rows.
- Redis: from outside the private network, `redis-cli -h <host> ping` is refused. An ACL user cannot run `CONFIG GET`.
- Permission change: revoking a grant takes effect on the next request (perm version bump), and the menu updates over the websocket.

## Sources
- Next.js proxy rename: https://nextjs.org/docs/app/api-reference/functions/middleware , https://johnkavanagh.co.uk/articles/next-js-proxy-replaces-middleware/
- CVE-2025-29927: https://access.redhat.com/security/cve/CVE-2025-29927 , https://www.offsec.com/blog/cve-2025-29927
- Postgres RLS: https://www.postgresql.org/docs/14/ddl-rowsecurity.html , https://edana.ch/en/2026/06/25/ensuring-multi-tenant-data-isolation-with-postgresql-row-level-security-rls/
- Redis security: https://redis.io/docs/latest/operate/oss_and_stack/management/security/ , https://www.trendmicro.com/en_us/research/20/d/more-than-8-000-unsecured-redis-instances-found-in-the-cloud.html
- nestjs-cls: https://github.com/Papooch/nestjs-cls
