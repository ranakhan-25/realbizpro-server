# 0001. Super Admin Enterprise Authorization and RBAC Architecture

**Date**: 2026-11-04
**Status**: Proposed

## Summary

This specification establishes a clean enterprise architecture for managing users, organizations, roles, permissions, and features directly from the Super Admin dashboard. It preserves the existing Organization Admin dashboard without changes, ensuring tenant daily workflows remain completely uninterrupted. It introduces an interactive matrix for role permissions, organization module entitlements, and user role scoping that adheres to the Hermes brand visual palette with purposeful typography and zero generic templates.

## Context

RealBiz Pro serves multiple business organizations (tenants), each running modules like CRM, Inventory, Accounts, and Projects. Currently, the Super Admin dashboard has separate pages for organizations, users, roles, features, and permissions, but the operational relationships between them require tighter governance. When an enterprise creates a custom role or assigns permissions, the relationship must be clear: does a permission belong to a feature, does a role belong to a single organization or across all organizations, and what happens when an organization is not subscribed to a specific module?

The reference system demonstrated that permissions must always bind to a specific feature, features must bind to a module, roles aggregate permissions, and users receive roles. However, copying legacy patterns directly would introduce redundant legacy tables and disjointed interfaces. The challenge is to unify these relationships into an enterprise grade data flow where the Super Admin can govern everything centrally while the Organization Admin interface remains stable and untouched.

## Requirements

**User stories**:
- As a Super Admin, I want to define features under modules and attach granular actions to them so that every functional capability has an explicit code and route.
- As a Super Admin, I want to create and edit roles using a visual permission matrix grouped by module and feature so that configuring access is intuitive and error free.
- As a Super Admin, I want to assign users to organizations and roles with optional custom permission overrides so that security governance is both standardized and flexible.
- As a Super Admin, I want to grant module entitlements to organizations so that tenant roles cannot access modules their organization does not own.
- As an Organization Admin, I want my existing dashboard to continue functioning exactly as it does today with no breaking modifications to my day to day workspace.

**Acceptance criteria**:
- **AC-1**: Every permission record in the database must reference a valid feature identifier (`feature_id`) and declare an action (`create`, `read`, `update`, `delete`, `manage`).
- **AC-2**: Roles must support an optional organization scope (`org_id` nullable), where null indicates a global system role and a numeric value indicates an organization specific role.
- **AC-3**: When a Super Admin edits role permissions, the UI displays an interactive matrix organized by module tabs and collapsible feature rows with select all toggles.
- **AC-4**: Organization module entitlements (`sys_org_entitlements`) act as an outer security boundary; users inside an organization can only inherit permissions for features whose parent module is entitled to that organization.
- **AC-5**: Direct user permission overrides (`sys_user_permissions`) allow granting or revoking specific permissions for an individual user without creating one off roles.
- **AC-6**: The Organization Admin dashboard routes (`/dashboard/*`) and APIs remain untouched, receiving pre resolved access profiles via `user-access.service.ts`.
- **AC-7**: The Super Admin UI uses the Hermes brand color system (deep midnight `#060814`, electric cobalt `#0000F2`, electric cyan `#3B82F6`, crisp white text `#EDEDF2`, slate borders `#1E293B`) with high contrast cards and no generic templates.

## Options considered

### Option 1: Direct replication of legacy reference tables
Create separate tables mirroring the legacy system with duplicate POS and HRM permission endpoints.

**Pros**:
- Exactly matches the legacy system screens.

**Cons**:
- Duplicates existing models in RealBiz Pro.
- Introduces technical debt, inconsistent naming, and high maintenance overhead.
- Violates single source of truth principles for multi tenant organizations.

### Option 2: Unified relational enterprise governance (Recommended)
Consolidate relationships around the existing `sys_modules`, `sys_features`, `sys_permissions`, `sys_roles`, `sys_organizations`, and `sys_users` tables. Add an interactive matrix component in the Super Admin dashboard to manage feature permission bindings, organization entitlements, and user assignments, while keeping the Organization Admin dashboard decoupled.

**Pros**:
- Clean relational design using existing Sequelize models without schema bloat.
- Guarantees strict multi tenant data isolation.
- Organization Admin dashboard experiences zero downtime or breaking changes.
- Enterprise scale performance with indexed foreign keys and cached permission trees.

**Cons**:
- Requires updating the Super Admin role editor modal to present the grouped module and feature matrix.

## Decision

**Chosen option**: Option 2: Unified relational enterprise governance.

We will govern multi tenant authorization by linking modules to features, features to permissions, permissions to roles, and roles to users scoped by organization, while keeping tenant facing dashboards completely intact.

## Architecture and Feature Design

### Data Model Relationships

```
┌────────────────┐       1:N       ┌────────────────┐       1:N       ┌────────────────┐
│   SysModules   │ ─────────────── │  SysFeatures   │ ─────────────── │ SysPermissions │
└────────────────┘                 └────────────────┘                 └────────────────┘
        │                                                                     │
        │ 1:N                                                                 │ N:M
        ▼                                                                     ▼
┌────────────────────┐     N:M     ┌────────────────┐     N:M         ┌────────────────┐
│ SysOrgEntitlement  │ ─────────── │SysOrganization │ ─────────────── │    SysRoles    │
└────────────────────┘             └────────────────┘ (org_id null/N) └────────────────┘
                                           │                                  │
                                           │ 1:N                              │ N:M
                                           ▼                                  ▼
                                   ┌────────────────┐      N:M        ┌────────────────┐
                                   │    SysUsers    │ ─────────────── │  SysUserRoles  │
                                   └────────────────┘                 └────────────────┘
                                           │
                                           │ N:M (Direct Overrides)
                                           ▼
                                   ┌────────────────────┐
                                   │ SysUserPermissions │
                                   └────────────────────┘
```

### Relational Invariants and Rules:
1. **Module to Feature (1 to Many)**:
   Every feature record has a mandatory `module_id`. Features can also declare a `parent_group` or delimiter (`Fleet & Transport | Vehicles`) for hierarchical display.
2. **Feature to Permission (1 to Many)**:
   Every permission has a mandatory `feature_id`. Actions follow standard verbs (`create`, `read`, `update`, `delete`, `manage`). The unique key (`code` or `slug`) is computed as `${module_code}_${feature_code}_${action}`.
3. **Role Scoping**:
   A role with `org_id = null` is a system wide template role (such as General Manager or Auditor). A role with `org_id = 14` is a custom role created by or for organization 14.
4. **Tenant Module Gate**:
   An organization can only use features if its record in `sys_org_entitlements` has `is_active = true` for that feature's parent module.
5. **Resolution Precedence**:
   Effective permissions for a user = `(Permissions from User Assigned Roles that belong to Org Entitled Modules) + (Direct User Granted Permissions) - (Direct User Revoked Permissions)`. Super Admin users bypass all restrictions.

### API Surface

| Endpoint | Method | Key Inputs | Key Outputs | Auth | Description |
|---|---|---|---|---|---|
| `/realbizpro/api/v1/admin/roles/matrix` | GET | `orgId` (optional) | Tree of modules with features and permissions | Super Admin | Loads permission catalog for matrix UI |
| `/realbizpro/api/v1/admin/roles` | POST | `name`, `code`, `orgId`, `permissionIds` | Created role object | Super Admin | Creates a role with mapped permissions |
| `/realbizpro/api/v1/admin/roles/:id` | PUT | `name`, `permissionIds` | Updated role object | Super Admin | Updates role attributes and permissions |
| `/realbizpro/api/v1/admin/users/:id/access` | GET | `userId` | User roles, orgs, and direct overrides | Super Admin | Loads user authorization profile |
| `/realbizpro/api/v1/admin/users/:id/access` | PUT | `roleIds`, `directPermissions` | Updated access summary | Super Admin | Saves user role bindings and overrides |
| `/realbizpro/api/v1/admin/orgs/:id/entitlements` | GET | `orgId` | List of entitled modules and features | Super Admin | Fetches organization module quotas |
| `/realbizpro/api/v1/admin/orgs/:id/entitlements` | PUT | `moduleIds`, `limits` | Updated entitlements list | Super Admin | Updates tenant module access |

### User Interface Design and Anti Generic Visual System

To eliminate generic AI visual patterns and maintain strict brand integrity:
1. **Canvas & Atmosphere**:
   Background uses deep midnight `#060814` for headers and dark surfaces, with crisp slate `#F8FAFC` for high density administrative tables.
2. **Color Accents**:
   Primary actions use electric cobalt blue `#0000F2` with hover glow `#3B82F6`. Focus rings use translucent cobalt `#0000F2` with two pixel offsets.
3. **Typography**:
   Clean geometric sans serif type with clear scale hierarchy. Tabular numbers enabled for IDs, counts, and dates. Labels avoid all uppercase shouting; badges use subtle pill containers with semi bold text.
4. **Interactive Matrix Component**:
   The permission picker uses a segmented module control (`Accounts`, `CRM`, `Inventory`, `Projects`, `HRM`, `System`). Inside, features display as clean cards with select all toggles, and individual permissions appear as tactile checkboxes with instant keyboard navigation.

## Build Plan

1. **Verify Backend Models and Foreign Keys** (`AC-1`, `AC-2`):
   Verify that `sys_permissions` has foreign key `feature_id` pointing to `sys_features`, and `sys_roles` has optional `org_id` pointing to `sys_organizations`.
2. **Build Super Admin Roles Matrix API** (`AC-3`):
   Create `GET /admin/roles/matrix` endpoint in the roles module returning modules, nested features, and available permission checkboxes in one fast indexed query.
3. **Build Super Admin User Access API** (`AC-5`):
   Create `GET` and `PUT` endpoints for `/admin/users/:id/access` managing `sys_user_roles` and `sys_user_permissions` atomically.
4. **Develop Super Admin Matrix UI Component** (`AC-3`, `AC-7`):
   Build the reusable `RolePermissionMatrixModal` component in the frontend admin dashboard with Hermes theme styling, module tabs, and batch select controls.
5. **Update Super Admin Users Page** (`AC-5`, `AC-7`):
   Enhance `/admin/users` with action buttons for Edit Roles and Direct Permissions, allowing seamless user access assignment.
6. **Verify Organization Dashboard Isolation** (`AC-6`):
   Run end to end integration tests ensuring `/dashboard` and Organization Admin views continue operating without any changes.

## Critical Test Scenarios

- **Scenario 1 (Matrix Persistence)**: Super Admin opens Add Role, selects Accounts module, toggles three features, and clicks Save. The server creates entries in `sys_roles` and `sys_role_permissions`.
- **Scenario 2 (Tenant Module Boundary)**: Organization A is entitled only to CRM. A custom role in Organization A containing Accounts permissions is assigned to User A. User A logs in; `user-access.service.ts` verifies Org entitlements and filters out Accounts routes, granting only CRM.
- **Scenario 3 (Direct Override Precedence)**: User B has a role that lacks `delete_invoice`. Super Admin grants a direct user permission override for `delete_invoice`. User B receives the ability to delete invoices.
- **Scenario 4 (Org Admin Dashboard Zero Regression)**: Organization Admin logs into `/dashboard`. All navigation links, operational modules, and action buttons render without errors or schema mismatches.

## Consequences

**Positive**:
- Centralized, enterprise grade governance for multi tenant organizations.
- Zero breaking changes or risks to existing Organization Admin daily operations.
- Clean relational design eliminating redundant database tables.
- Fast permission resolution with high performance caching.
- Distinctive, premium user interface matching the Hermes design language.

**Negative & Tradeoffs**:
- Initial migration requires ensuring all legacy permission records are correctly linked to a parent feature ID.

**Risks & Mitigations**:
- *Risk*: A permission record with null `feature_id` could be omitted from the UI matrix.
- *Mitigation*: Create a database sanity migration script that assigns any orphaned permissions to a general system feature.

## Follow-up

1. Review and ratify this specification.
2. Implement the backend roles matrix endpoint and update the Super Admin UI components.
3. Add automated test coverage verifying multi tenant isolation.
