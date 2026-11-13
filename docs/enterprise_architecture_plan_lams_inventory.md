# Enterprise Architecture Plan: LAMS and Inventory Backend

## Executive Summary
This document establishes the enterprise grade architecture plan for the Land Acquisition and Management System (LAMS, Module 02) and the Inventory Management System (Module 10) in `realbiz_pro_server`.

The primary design principle is strict multi tenant isolation. The tenant boundary is governed exclusively by `org_id`, which is strictly non optional (`allowNull: false`) across all primary entities, relational tables, and movements. No cross tenant data leakage is permissible.

---

## 1. Multi Tenant Isolation and Security Blueprint

```
+-----------------------------------------------------------------------------------+
|                              Client Web Application                               |
|       (Sends Authorization: Bearer JWT with claims: sub, org_id, roles)           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        NestJS API Gateway / Reverse Proxy                         |
|   - Rate Limiter (ThrottlerGuard): Prevents API scraping and DDoS                 |
|   - Helmet Security Headers: X-Frame-Options, Content Security Policy             |
|   - Global Validation Pipe: Whitelist only, strip extra fields, reject bad types  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           Tenant Security Middleware                              |
|   - JwtAuthGuard: Verifies cryptographic signature and expiry                     |
|   - TenantContextInterceptor: Extracts org_id from JWT payload                    |
|   - Injects tenant context into AsyncLocalStorage or Request object               |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                      Service Layer with Tenant Scoping                            |
|   - Automatically binds { where: { org_id } } to every read and write             |
|   - Validates that foreign key targets belong to the identical org_id             |
|   - Executes sensitive mutations inside Sequelize Isolation Transactions          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         PostgreSQL Relational Storage                             |
|   - Composite Indexes: (org_id, id), (org_id, status), (org_id, created_at)      |
|   - Mandatory NOT NULL constraint on org_id across all tables                     |
|   - Soft Deletes (Paranoid) preserving audit trails and deleted_by metadata       |
+-----------------------------------------------------------------------------------+
```

### Key Security Standards
1. **Mandatory Tenant Key (`org_id`)**:
   Every database table and Sequelize model enforces `@Column({ type: DataType.STRING, allowNull: false }) declare org_id: string;`. If any request attempts to create or fetch an entity without a valid `org_id`, the request immediately fails with a `400 Bad Request` or `403 Forbidden` response.
2. **Token Bound Tenant Extraction**:
   Controllers and services never rely on client supplied query parameters or request body values for `org_id`. The authenticated user token extracted via `@CurrentUser()` provides the trusted `org_id`.
3. **Role Based Access Control (RBAC)**:
   Every route is guarded with `@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)` checking specific granular permissions such as `lams.leads.create`, `lams.leads.advance_stage`, `inventory.issues.create`, or `inventory.counts.approve`.
4. **Auditability and Soft Deletes**:
   All entities extend `BaseModel` inheriting `created_by`, `added_by`, `deleted_by`, `created_at`, `updated_at`, and `deleted_at`. Deletion operations perform paranoid soft deletes to ensure no historical records or financial footprints are destroyed.
5. **ACID Transaction Locks for Material & Financial Flows**:
   All inventory ledger updates, material issues, and settlement disbursements run inside `sequelize.transaction()` with pessimistic row locks (`transaction.LOCK.UPDATE`) to completely prevent race conditions or negative balances.

---

## 2. Performance and Scalability Architecture

1. **High Performance Composite Indexing**:
   Single column indexes on large multi tenant databases cause slow sequential table scans. We define composite indexes prefixing `org_id` on every query path:
   * `lams_acquisition_leads`: `(org_id, lead_status)`, `(org_id, lead_code)`, `(org_id, created_at DESC)`
   * `lams_land_owners`: `(org_id, nid_number)`, `(org_id, contact_number)`
   * `lams_negotiation_processes`: `(org_id, lead_id, round_no)`
   * `inv_stock_balances`: `(org_id, warehouse_id, item_id)` (Unique constraint and lookup index)
   * `inv_movements`: `(org_id, movement_type, created_at DESC)`, `(org_id, item_id, warehouse_id)`
2. **Aggregated Stock Balance Table (`inv_stock_balances`)**:
   Computing current stock by running aggregate `SUM()` queries over thousands of movement rows degrades database performance under high load. We introduce an O(1) balance table (`inv_stock_balances`). When a stock movement is posted, the balance table is updated atomically using PostgreSQL `ON CONFLICT (org_id, warehouse_id, item_id) DO UPDATE SET quantity = quantity + :delta`.
3. **Selective Projection & Keyset Pagination**:
   API responses omit heavy text fields or large relational arrays on list views. List queries use standardized pagination (`page`, `limit` capped at 100 entries) with total count estimation to minimize memory consumption.
4. **Master Data In Memory Caching**:
   Frequently read, rarely changed lookup tables (Categories, Brands, Units, Warehouses) utilize cache tags keyed by `org_id` to eliminate redundant database queries.

---

## 3. Database Schema Blueprint: New and Updated Tables

### A. LAMS Module (Land Acquisition and Management System)

#### 1. Updated Table: `lams_acquisition_leads`
* `id`: UUID (Primary Key)
* `org_id`: VARCHAR(100), NOT NULL, Indexed
* `lead_code`: VARCHAR(50), NOT NULL, Unique per org (e.g. `LAD-2026-001`)
* `lead_title`: VARCHAR(255), NOT NULL
* `lead_date`: DATEONLY, NOT NULL
* `land_type`: VARCHAR(100) (Agricultural, Commercial, Residential, Industrial)
* `location`: TEXT, NOT NULL (Address / Street)
* `mouza`: VARCHAR(150) (Mouza name)
* `khatian_no`: VARCHAR(100) (CS, SA, RS, or City Khatian)
* `dag_no`: VARCHAR(100) (Plot or Dag number)
* `area_katha`: DECIMAL(12, 4), NOT NULL
* `area_sqft`: DECIMAL(15, 2), NULL
* `asking_price`: DECIMAL(15, 2), NOT NULL DEFAULT 0
* `source`: VARCHAR(100) NOT NULL (Direct Owner, Broker, Referral, Media, Cold Contact)
* `priority`: VARCHAR(20) NOT NULL DEFAULT 'Medium' (High, Medium, Low)
* `lead_status`: VARCHAR(50) NOT NULL DEFAULT 'Draft' (Draft, Submitted, Qualified, In Negotiation, Approved, Rejected, Purchased)
* `assigned_to`: VARCHAR(100), NULL (Assignee user reference)
* `notes`: TEXT, NULL
* `co_owners_json`: JSONB, NULL
* `map_url`: VARCHAR(500), NULL
* Standard audit columns: `created_by`, `added_by`, `deleted_by`, timestamps, soft delete

#### 2. Updated Table: `lams_land_owners`
* `id`: UUID (Primary Key)
* `org_id`: VARCHAR(100), NOT NULL, Indexed
* `lead_id`: UUID, NULL (Nullable to support central landowner directory)
* `owner_type`: VARCHAR(50) NOT NULL DEFAULT 'Owner'
* `name`: VARCHAR(255), NOT NULL
* `father_name`: VARCHAR(255), NULL
* `contact_number`: VARCHAR(50), NOT NULL
* `email`: VARCHAR(150), NULL
* `address`: TEXT, NULL
* `nid_number`: VARCHAR(50), NULL
* `ownership_percentage`: DECIMAL(5, 2), NOT NULL DEFAULT 100.00
* `bank_name`: VARCHAR(150), NULL
* `bank_account`: VARCHAR(100), NULL
* `nominee_json`: JSONB, NULL (Array of nominee objects with name, relation, nid, phone)
* Standard audit columns: `created_by`, `added_by`, `deleted_by`, timestamps, soft delete

#### 3. Updated Table: `lams_negotiation_processes`
* `id`: UUID (Primary Key)
* `org_id`: VARCHAR(100), NOT NULL, Indexed
* `lead_id`: UUID, NOT NULL, Indexed
* `round_no`: INTEGER, NOT NULL DEFAULT 1
* `negotiation_date`: DATE, NOT NULL
* `offered_price`: DECIMAL(15, 2), NOT NULL DEFAULT 0
* `counter_amount`: DECIMAL(15, 2), NOT NULL DEFAULT 0 (Owner counter offer)
* `gap_amount`: DECIMAL(15, 2), NOT NULL DEFAULT 0 (Calculated variance)
* `agreed_price`: DECIMAL(15, 2), NOT NULL DEFAULT 0
* `negotiator`: VARCHAR(150), NULL
* `negotiation_status`: VARCHAR(50) NOT NULL DEFAULT 'Pending' (Pending, Agreed, Disputed, Escalate)
* `next_meeting_date`: DATE, NULL
* `meeting_notes`: TEXT, NULL
* Standard audit columns: `created_by`, timestamps, soft delete

#### 4. New Table: `lams_lead_stage_logs` (Workflow Audit Trail)
Tracks every forward or backward movement of a lead parcel through the acquisition lifecycle.
* `id`: UUID (Primary Key)
* `org_id`: VARCHAR(100), NOT NULL, Indexed
* `lead_id`: UUID, NOT NULL, Indexed
* `from_stage`: VARCHAR(50), NOT NULL
* `to_stage`: VARCHAR(50), NOT NULL
* `remarks`: TEXT, NOT NULL (Mandatory justification submitted by user)
* `transitioned_by`: VARCHAR(100), NOT NULL
* `created_at`: TIMESTAMP WITH TIME ZONE, NOT NULL

#### 5. New Table: `lams_settlement_payments` (Disbursement Schedule & Milestone Payments)
Tracks milestone payments and installment disbursements against land purchases.
* `id`: UUID (Primary Key)
* `org_id`: VARCHAR(100), NOT NULL, Indexed
* `settlement_id`: UUID, NOT NULL, Indexed
* `lead_id`: UUID, NOT NULL, Indexed
* `payment_no`: VARCHAR(50), NOT NULL
* `installment_no`: INTEGER, NOT NULL DEFAULT 1
* `amount`: DECIMAL(15, 2), NOT NULL
* `payment_date`: DATEONLY, NOT NULL
* `payment_method`: VARCHAR(50), NOT NULL (Bank Transfer, Cheque, Pay Order, Cash)
* `reference_no`: VARCHAR(100), NULL (Cheque or Transaction number)
* `status`: VARCHAR(50), NOT NULL DEFAULT 'completed' (scheduled, processing, completed, bounced)
* `remarks`: TEXT, NULL
* Standard audit columns: `created_by`, timestamps, soft delete

---

### B. Inventory Module (Module 10)

#### 1. Core Master Data Tables (Updated with mandatory `org_id`)
* `inv_categories`: `org_id` (NOT NULL), `category_code`, `name`, `type`, `inventory_coa`, `consumption_coa`
* `inv_sub_categories`: `org_id` (NOT NULL), `category_id`, `sub_category_code`, `name`
* `inv_brands`: `org_id` (NOT NULL), `code`, `name`
* `inv_units`: `org_id` (NOT NULL), `code`, `name`, `conversion_unit`, `rate`
* `inv_items`: `org_id` (NOT NULL), `item_code`, `sku`, `name`, `category_id`, `brand_id`, `unit_id`, `reorder_level`, `min_qty`, `max_qty`, `avg_cost`, `purchase_price`, `sale_price`, `barcode`, `status`
* `inv_warehouses`: `org_id` (NOT NULL), `code`, `name`, `location`, `type` (central, site, transit), `is_active`

#### 2. New Table: `inv_stock_balances` (Real Time Stock Summary)
* `id`: UUID (Primary Key)
* `org_id`: VARCHAR(100), NOT NULL
* `warehouse_id`: BIGINT or UUID, NOT NULL
* `item_id`: BIGINT or UUID, NOT NULL
* `current_qty`: DECIMAL(15, 4), NOT NULL DEFAULT 0
* `reserved_qty`: DECIMAL(15, 4), NOT NULL DEFAULT 0
* `available_qty`: DECIMAL(15, 4), NOT NULL DEFAULT 0
* `avg_cost`: DECIMAL(15, 2), NOT NULL DEFAULT 0
* `last_movement_at`: TIMESTAMP WITH TIME ZONE
* Unique Composite Index: `(org_id, warehouse_id, item_id)`

#### 3. New Table: `inv_movements` (Immutable Double Entry Material Ledger)
Every inventory action creates an audit ledger row in this table.
* `id`: UUID (Primary Key)
* `org_id`: VARCHAR(100), NOT NULL, Indexed
* `movement_no`: VARCHAR(50), NOT NULL (e.g. `MOV-2026-0001`)
* `movement_type`: VARCHAR(50), NOT NULL (opening, issue, return, transfer, adjustment, consumption)
* `movement_date`: DATEONLY, NOT NULL
* `item_id`: BIGINT or UUID, NOT NULL, Indexed
* `warehouse_id`: BIGINT or UUID, NOT NULL, Indexed (Origin or primary warehouse)
* `to_warehouse_id`: BIGINT or UUID, NULL (Destination warehouse for transfers)
* `quantity`: DECIMAL(15, 4), NOT NULL
* `unit_rate`: DECIMAL(15, 2), NOT NULL DEFAULT 0
* `total_amount`: DECIMAL(15, 2), NOT NULL DEFAULT 0
* `reference_type`: VARCHAR(50), NULL (project, lead, requisition, physical_count)
* `reference_id`: VARCHAR(100), NULL
* `issued_to`: VARCHAR(150), NULL
* `reason`: TEXT, NULL
* `notes`: TEXT, NULL
* Standard audit columns: `created_by`, timestamps

#### 4. Specialized Movement Sub Tables (Linked with `inv_movements`)
* `inv_stock_returns`: Handles unused materials returned to store from project or site.
* `inv_stock_adjustments`: Captures physical inventory discrepancies, damage, or scrap with approval workflows.
* `inv_stock_consumptions`: Direct site consumption records tagging exact structural usage.

---

## 4. API Endpoints Specification

### LAMS Module API Routes
| HTTP Method | Route Endpoint | Description | Guard / RBAC |
|---|---|---|---|
| `GET` | `/realbizpro/api/v1/lams/acquisition-leads` | List leads with filtering, pagination, search | JwtAuthGuard, `lams.leads.read` |
| `POST` | `/realbizpro/api/v1/lams/acquisition-leads` | Create lead (3 step form payload) | JwtAuthGuard, `lams.leads.create` |
| `GET` | `/realbizpro/api/v1/lams/acquisition-leads/:uuid` | Get complete 360 lead details with tabs | JwtAuthGuard, `lams.leads.read` |
| `PUT` | `/realbizpro/api/v1/lams/acquisition-leads/:uuid` | Update lead parcel details | JwtAuthGuard, `lams.leads.update` |
| `DELETE` | `/realbizpro/api/v1/lams/acquisition-leads/:uuid` | Soft delete lead parcel | JwtAuthGuard, `lams.leads.delete` |
| `POST` | `/realbizpro/api/v1/lams/acquisition-leads/:uuid/advance-stage` | Advance stage with mandatory remarks | JwtAuthGuard, `lams.leads.advance_stage` |
| `POST` | `/realbizpro/api/v1/lams/acquisition-leads/:uuid/qualify` | Quick qualify lead | JwtAuthGuard, `lams.leads.qualify` |
| `POST` | `/realbizpro/api/v1/lams/acquisition-leads/:uuid/reject` | Reject lead with remarks | JwtAuthGuard, `lams.leads.reject` |
| `GET` | `/realbizpro/api/v1/lams/land-owners` | List landowners with NID and land count filters | JwtAuthGuard, `lams.owners.read` |
| `POST` | `/realbizpro/api/v1/lams/land-owners` | Create landowner profile with bank and nominees | JwtAuthGuard, `lams.owners.create` |
| `PUT` | `/realbizpro/api/v1/lams/land-owners/:uuid` | Update landowner profile | JwtAuthGuard, `lams.owners.update` |
| `DELETE` | `/realbizpro/api/v1/lams/land-owners/:uuid` | Soft delete landowner profile | JwtAuthGuard, `lams.owners.delete` |
| `GET` | `/realbizpro/api/v1/lams/negotiation-processes` | List negotiation rounds | JwtAuthGuard, `lams.negotiations.read` |
| `POST` | `/realbizpro/api/v1/lams/negotiation-processes` | Record negotiation meeting round | JwtAuthGuard, `lams.negotiations.create` |
| `POST` | `/realbizpro/api/v1/lams/settlements/:uuid/payments` | Record disbursement payment | JwtAuthGuard, `lams.settlements.pay` |

### Inventory Module API Routes
| HTTP Method | Route Endpoint | Description | Guard / RBAC |
|---|---|---|---|
| `GET` | `/realbizpro/api/v1/inventory/items` | List items with filters and pagination | JwtAuthGuard, `inventory.items.read` |
| `POST` | `/realbizpro/api/v1/inventory/items` | Create new inventory item | JwtAuthGuard, `inventory.items.create` |
| `GET` | `/realbizpro/api/v1/inventory/warehouses` | List warehouses | JwtAuthGuard, `inventory.warehouses.read` |
| `POST` | `/realbizpro/api/v1/inventory/warehouses` | Create warehouse | JwtAuthGuard, `inventory.warehouses.create` |
| `GET` | `/realbizpro/api/v1/inventory/balance` | Real time stock balances by warehouse | JwtAuthGuard, `inventory.balance.read` |
| `GET` | `/realbizpro/api/v1/inventory/ledger` | Double entry material movement ledger | JwtAuthGuard, `inventory.ledger.read` |
| `POST` | `/realbizpro/api/v1/inventory/opening` | Post opening stock balance | JwtAuthGuard, `inventory.opening.create` |
| `POST` | `/realbizpro/api/v1/inventory/issues` | Issue material from warehouse | JwtAuthGuard, `inventory.issues.create` |
| `POST` | `/realbizpro/api/v1/inventory/returns` | Material return to warehouse | JwtAuthGuard, `inventory.returns.create` |
| `POST` | `/realbizpro/api/v1/inventory/transfers` | Inter warehouse stock transfer | JwtAuthGuard, `inventory.transfers.create` |
| `POST` | `/realbizpro/api/v1/inventory/adjustments` | Stock adjustment (damage, shortage, excess) | JwtAuthGuard, `inventory.adjustments.create` |
| `POST` | `/realbizpro/api/v1/inventory/consumption` | Site material consumption | JwtAuthGuard, `inventory.consumption.create` |
| `GET` | `/realbizpro/api/v1/inventory/counts` | Physical stock count orders | JwtAuthGuard, `inventory.counts.read` |
| `POST` | `/realbizpro/api/v1/inventory/counts` | Record physical stock count reconciliation | JwtAuthGuard, `inventory.counts.create` |
| `GET` | `/realbizpro/api/v1/inventory/slow-moving` | Slow moving and aging stock analytics | JwtAuthGuard, `inventory.reports.read` |

---

## 5. Phased Execution Roadmap

* **Phase 1: Database Migration and Models Update**
  Add missing columns to `lams_acquisition_leads`, `lams_land_owners`, and `lams_negotiation_processes`. Create `lams_lead_stage_logs`, `lams_settlement_payments`, `inv_stock_balances`, and `inv_movements`. Enforce `allowNull: false` on `org_id`.
* **Phase 2: DTOs, Validation and Tenant Context**
  Update NestJS DTOs with validation rules for all newly introduced fields. Ensure `org_id` is automatically injected from JWT claims.
* **Phase 3: Controller and Service Layer Implementation**
  Add workflow advancement routes (`advance-stage`, `qualify`, `reject`), settlement payment creation, and full inventory movement endpoints with transaction safety.
* **Phase 4: End to End Verification**
  Run backend integration tests, verify PostgreSQL schema migrations, and test frontend connectivity across LAMS and Inventory modules.
