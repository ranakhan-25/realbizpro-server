# Wholesale Module Implementation Plan (Final MVP Blueprint)

This blueprint incorporates the final adjustments for a production-ready MVP. It establishes a completely isolated module directory to prevent code clutter, prevents monolithic services through strict separation of responsibilities, and provides 100% surety that existing POS sales are unbothered.

## User Review Required

> [!IMPORTANT]
> The plan now includes the **Directory Structure & Service Isolation** strategy as requested. Everything will be grouped under `src/modules/wholesale`. If you approve this structure, we will begin Phase 1 immediately!

---

## Directory Structure & Service Isolation (Anti-Monolith Strategy)

To ensure this module doesn't bloat into a 1000-line unmaintainable file and stays completely isolated from the existing `pos-sale` code, all new API endpoints, controllers, and services will be housed in a centralized directory: `src/modules/wholesale/`.

Inside this folder, we will create domain-driven submodules:

1.  **`src/modules/wholesale/wholesale-config/`** (Policy management)
2.  **`src/modules/wholesale/wholesale-sale/`** (Order creation & lifecycle)
3.  **`src/modules/wholesale/wholesale-ledger/`** (Customer ledger views)
4.  **`src/modules/wholesale/wholesale-courier-collection/`** (COD aggregation & settlement)

**Service Grouping (Anti-Monolith Rule):**
Instead of one massive `wholesale-sale.service.ts`, we will break logic into specific single-responsibility services:

- `wholesale-sale-validation.service.ts`: Checks `allowPreviousDue`, cart minimums, seller types, and limits.
- `wholesale-sale-calculation.service.ts`: Does the exact math for `netAmount`, `codAmount`, and `dueAmount`.
- `wholesale-sale-accounting.service.ts`: Handles the journal voucher matrix specifically for wholesale.
- `wholesale-sale-core.service.ts`: Only handles orchestrating the transaction and calling the above services.

---

## Retail Zero-Interruption Guarantee

To provide **100% surety** that the new Wholesale features will not interrupt existing retail POS sales or accounting, we will implement the following strict isolation protocols:

1.  **Database Isolation:** All 11 new fields added to the existing `pos_sale` table (`saleType`, `courierId`, `courierChargePaidBy`, `codFeePaidBy`, `deliveryCharge`, `codFee`, `paidAmount`, `dueAmount`, `codAmount`, `deliveryStatus`, `codStatus`) will be configured with `allowNull: true` or explicit default values (e.g., `defaultValue: 'RETAIL'`). Existing retail sales will ignore these fields without failing constraints.
2.  **API Separation:** The wholesale order creation exists on a completely new endpoint (`POST /wholesale/sales`) isolated inside the new `wholesale` module directory. The legacy retail `pos-sale` endpoints are untouched.
3.  **Accounting Isolation:** When routing journal vouchers, new wholesale events will be strictly wrapped in `if (sale.saleType === 'WHOLESALE')`. Retail POS accounting logic runs unmodified.
4.  **DTO Safety:** All new fields in shared DTOs will use `@IsOptional()`.

---

## Pre-Implementation: Accounting Matrix Definition

We reuse the existing voucher infrastructure, strictly mapped as follows:

| Event                                                | Debit (Dr)      | Credit (Cr)                  |
| :--------------------------------------------------- | :-------------- | :--------------------------- |
| **1. Wholesale Invoice**                             | Customer AR     | Wholesale Sales              |
| **2. Customer Advance Payment**                      | Cash/Bank       | Customer AR                  |
| **3. Partial Payment**                               | Cash/Bank       | Customer AR                  |
| **4. Courier Delivery Charge (Company bears)**       | Courier Expense | Accounts Payable - Courier   |
| **5. Order Delivered (COD transferred)**             | Courier AR      | Customer AR (for COD amount) |
| **6. Courier Cash Collection (Settlement)**          | Cash/Bank       | Courier AR                   |
| **7. Failed Delivery (Reverse Sale)**                | Sales Return    | Customer AR                  |
| **8. Failed Delivery (Refund Advance)**              | Customer AR     | Cash/Bank                    |
| **9. Failed Delivery (Courier Penalty on Customer)** | Customer AR     | Penalty Income               |

---

## Phase 1: Robust Database Schema & ORM Models

### 1.1 `SysCourier`

**File:** `src/database/models/system/sys_courier.model.ts`

- `id`, `name`, `code`, `phone`, `email`, `address`, `codChargeType`, `codChargeValue`, `accountId`, `isActive`, audit fields.

### 1.2 `PosWholesaleConfig`

**File:** `src/database/models/hrm/sale/pos_wholesale_config.model.ts`

- `id`, `warehouseId` (Nullable), `minPurchaseAmount`, `minPurchaseQty`, `minPercentageToPay`, `maxDiscountPercent`, `allowPreviousDue`, audit fields.

### 1.3 `PosCustomerLedger`

**File:** `src/database/models/hrm/sale/pos_customer_ledger.model.ts`

- `id`, `customerId`, `referenceType` (`INVOICE`, `PAYMENT`, `RETURN`, `PENALTY`, `REFUND`, `ADJUSTMENT`), `referenceId`, `debit`, `credit`, `transactionDate`, `notes`. (Immutable; no `balance`).

### 1.4 `PosSale` (Financial Modifiers)

- **New Fields:** `saleType`, `courierId`, `courierChargePaidBy` (`COMPANY`, `CUSTOMER`), `codFeePaidBy` (`COMPANY`, `CUSTOMER`), `deliveryCharge`, `codFee`, `paidAmount`, `dueAmount`, `codAmount`.
- **Statuses:** `deliveryStatus`, `codStatus`. Utilizes existing `billNumber` for order tracking.

### 1.5 `PosSaleDeliveryHistory`

**File:** `src/database/models/hrm/sale/pos_sale_delivery_history.model.ts`

- `id`, `saleId`, `status`, `courierId`, `trackingNumber`, `remarks`, `changedBy`, `changedAt`.

### 1.6 Courier Collection Junction Models

**Files:** `pos_courier_cash_collection.model.ts` & `pos_courier_cash_collection_item.model.ts`

- `id`, `courierId`, `collectionDate`, `amount`, `status`, `accountingStatus`, `accountingPostedAt`, `idempotencyKey`.
- Items link specific `saleId` to `codAmount` collected.

---

## Phase 2: Configuration APIs & Permissions

- `GET/POST/PATCH /wholesale/couriers` (`view_courier`, `manage_courier`)
- `GET/PATCH /wholesale/wholesale-config` (`view_wholesale_config`, `manage_wholesale_config`)

---

## Phase 3: Core Wholesale Sale Logic (Transaction Safe)

**Endpoint:** `POST /wholesale/sales` (`create_wholesale_sale`)

Orchestrated by `wholesale-sale-core.service.ts` inside `Sequelize.Transaction`:

1.  **Lock & Validate:** Calls `wholesale-sale-validation.service.ts` to check seller types and limits.
2.  **Calculate:** Calls `wholesale-sale-calculation.service.ts` to derive exact `saleAmount`, `netAmount`, `dueAmount`, and `codAmount`.
3.  **Create Records:** Saves `PosSale`, `PosSaleItem`, `PosSalePayment` (authoritative payment source).
4.  **Ledger:** Inserts Debit/Credit into `PosCustomerLedger` and `PENDING` into `PosSaleDeliveryHistory`.
5.  **Accounting:** Calls `wholesale-sale-accounting.service.ts` for Events #1 and #2.

---

## Phase 4: Delivery State Machine & Returns

**Endpoint:** `PATCH /wholesale/sales/:id/delivery-status` (`update_delivery_status`)

1.  **State Machine:** `PENDING` -> `SHIPPED` -> `DELIVERED` -> `FAILED`
2.  **Failed Delivery Logic:** Reverse sale, process refunds/penalties to `PosCustomerLedger`. Hit voucher service for Event #7.

---

## Phase 5: Courier Cash Collection

**Endpoint 1: `GET /wholesale/courier-dues` (`view_courier_dues`)**

- Calculates real outstanding COD (Delivered COD - APPROVED Collection Items).

**Endpoint 2: `POST /wholesale/courier-collection` (`create_courier_collection`)**

- Creates `PosCourierCashCollection` (PENDING) and Items. Validates `idempotencyKey`.

**Endpoint 3: `POST /wholesale/courier-collection/:id/approve` (`approve_courier_collection`)**

- Executes strictly locked transaction (`FOR UPDATE`). Prevents double posting by checking `accountingPostedAt`. Approves collection, updates COD statuses, and fires Accounting Event #6.
