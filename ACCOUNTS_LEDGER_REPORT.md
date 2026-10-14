# Accounts Ledger Posting System - Comprehensive Report

## Executive Summary

This report documents the Accounts Ledger (Double-Entry Bookkeeping) system in the Garmentech HRM API Service. The system implements automated journal voucher posting across multiple business modules including POS Sales, POS Sale Returns, and Showroom Bank Deposits.

---

## 1. Architecture Overview

### 1.1 Database Tables

| Table | Purpose |
|-------|---------|
| `ac_voucher_master` | Header of every journal voucher (voucher number, type, date, narration, showroom, status) |
| `ac_voucher_details` | Line items — each row is a debit or credit entry referencing a COA account |
| `ac_coa` | Chart of Accounts — master list of all accounts with head_code, head_name, head_type |
| `ac_predefined_accounts` | Maps logical keys (e.g. `showroom_cash`, `retail_sale`) → COA head_codes |
| `ac_financial_accounts` | Bank/fund accounts with COA linkage for bank deposit postings |
| `ac_financial_year` | Financial year boundaries for date-based voucher assignment |

### 1.2 Voucher Types

```typescript
enum VoucherTypeEnum {
  JV  = "JV",  // Journal Voucher — used for all automated postings
  PV  = "PV",  // Payment Voucher
  RV  = "RV",  // Receipt Voucher
  CV  = "CV",  // Contra Voucher
  DBV = "DBV", // Debit Voucher
  CRV = "CRV", // Credit Voucher
  BPV = "BPV", // Bank Payment Voucher
  BRV = "BRV", // Bank Receipt Voucher
}
```

> **Note:** Currently only `JV` (Journal Voucher) type is used for automated posting in this codebase.

### 1.3 Account Resolution Flow

```
Business Event (Sale/Return/Deposit)
        │
        ▼
┌──────────────────────────────────┐
│ 1. Build Journal Lines           │
│    (accountKey → debit/credit)   │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ 2. Resolve Predefined Accounts   │
│    ac_predefined_accounts        │
│    (account_key → key_head_code) │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ 3. Resolve COA                   │
│    ac_coa                        │
│    (head_code → id)              │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ 4. Create Voucher Master +       │
│    Voucher Details               │
│    (INSERT into tables)          │
└──────────────────────────────────┘
```

---

## 2. Where Ledger Posting Is Implemented

### 2.1 POS Sale Journal Voucher

**File:** `src/modules/pos-sale/pos-sale-journal-voucher.service.ts`

**Called from:** `src/modules/pos-sale/pos-sale.service.ts` (lines 690 and 879)

**Trigger:** Every time a sale is created or payments are updated.

**Class:** `PosSaleJournalVoucherService`

**Method:** `postSaleVoucher()`

#### Predefined Account Keys Used

| Key | Account | Type |
|-----|---------|------|
| `showroom_cash` | Showroom Cash | Debit |
| `pos_balance` | POS Card Balance | Debit |
| `pos_charge` | POS Card Charge (Expense) | Debit |
| `mfs` | Mobile Financial Services | Debit |
| `mfs_charge` | MFS Charge (Expense) | Debit |
| `sales_insentive` | Sales Incentive (Expense) | Debit |
| `sales_discount` | Sales Discount | Debit |
| `vat_payable` | VAT Payable | Debit/Credit |
| `retail_sale` | Sales Revenue | Credit |
| `sales_insentive_payable` | Sales Incentive Payable | Credit |

#### Journal Entry Logic

For a POS sale, the system builds lines as follows:

**Debit Entries (what you received):**
- Cash → `showroom_cash` (calculated as total payable minus CARD/MFS payments)
- Card payment → `pos_balance`
- MFS payment → `mfs`
- Card charges → `pos_charge`
- MFS charges → `mfs_charge`
- Sales incentive → `sales_insentive`
- Sales discount → `sales_discount`
- VAT adjustment → `vat_payable`

**Credit Entries (what you earned/owe):**
- Sales revenue → `retail_sale` (gross amount)
- VAT payable → `vat_payable` (10% of gross)
- Sales incentive payable → `sales_insentive_payable`

#### Example Data

**Scenario:** Customer buys items worth ৳11,000 (gross), pays ৳8,000 cash and ৳3,000 via card. VAT is ৳1,000. Sales incentive is ৳200.

```
JV Number: JV-BILL-20240115001
Voucher Date: 2024-01-15
Showroom: Dhaka Branch
Narration: POS Sale for Ref: BILL-20240115001 | Gross: 11000 | Net: 10000 | VAT: 1000

┌─────────────────────────┬──────────┬──────────┐
│ Account                 │ Debit    │ Credit   │
├─────────────────────────┼──────────┼──────────┤
│ Showroom Cash           │ 8,000.00 │          │
│ POS Card Balance        │ 3,000.00 │          │
│ Sales Revenue           │          │ 11,000.00│
│ VAT Payable             │          │ 1,000.00 │
│ Sales Incentive Payable │          │ 200.00   │
│ Sales Incentive (Exp)   │ 200.00   │          │
├─────────────────────────┼──────────┼──────────┤
│ TOTAL                   │ 11,200.00│ 12,200.00│
└─────────────────────────┴──────────┴──────────┘

Note: The system uses cents internally (multiply by 100) to avoid floating point issues.
```

---

### 2.2 POS Sale Return Journal Voucher

**File:** `src/modules/pos-sale/pos-sale-return-journal-voucher.service.ts`

**Called from:** `src/modules/pos-sale/websocket/services/pos-return.service.ts` (line 381)

**Trigger:** Every time a sale return is processed.

**Class:** `PosSaleReturnJournalVoucherService`

**Method:** `postSaleReturnVoucher()`

#### Predefined Account Keys Used

| Key | Account | Type |
|-----|---------|------|
| `sales_return` | Sales Return | Debit |
| `vat_payable` | VAT Payable (reversal) | Debit |
| `sales_insentive_payable` | Commission Payable Reversal | Debit |
| `showroom_cash` | Cash Refunded | Credit |
| `sales_discount` | Sales Discount Reversal | Credit |
| `sales_insentive` | Commission Expense Reversal | Credit |

#### Journal Entry Logic

**Debit Entries (reversal of original sale):**
- Sales return → `sales_return` (gross return amount)
- VAT payable reversal → `vat_payable` (10% of gross return)
- Commission payable reversal → `sales_insentive_payable` (proportional)

**Credit Entries (what is refunded):**
- Cash refund → `showroom_cash` (net + VAT)
- Sales discount reversal → `sales_discount`
- VAT adjustment reversal → `vat_payable`
- Commission expense reversal → `sales_insentive`

#### Example Data

**Scenario:** Customer returns items worth ৳5,500 (gross). Original sale ratio: ৳500 commission on ৳10,000 net (5%).

```
JV Number: JV-POS-RETURN-123-SALE-456
Voucher Date: 2024-01-20
Showroom: Dhaka Branch
Narration: POS Sale Return for Ref: POS-RETURN-123-SALE-456 | Gross: 5500 | Net: 5000

┌──────────────────────────────────┬──────────┬──────────┐
│ Account                          │ Debit    │ Credit   │
├──────────────────────────────────┼──────────┼──────────┤
│ Sales Return                     │ 5,500.00 │          │
│ VAT Payable (Principal Reversal) │ 550.00   │          │
│ Commission Payable Reversal      │ 250.00   │          │
│ Cash Refunded                    │          │ 5,500.00 │
│ Sales Discount Reversal          │          │ 500.00   │
│ VAT Adjustment Reversal          │          │ 50.00    │
│ Commission Expense Reversal      │          │ 250.00   │
├──────────────────────────────────┼──────────┼──────────┤
│ TOTAL                            │ 6,300.00 │ 6,300.00 │
└──────────────────────────────────┴──────────┴──────────┘
```

---

### 2.3 Showroom Bank Deposit Journal Voucher

**File:** `src/modules/showroom-bank-diposit/showroom-bank-diposit.service.ts`

**Called from:** Same file, method `postDepositJournalVoucher()` (lines 603-701)

**Trigger:** When a showroom bank deposit status changes to `Deposited`.

**Class:** `ShowroomBankDipositService`

**Method:** `postDepositJournalVoucher()`

#### Account Resolution

- **Debit:** Bank account → resolved from `ac_financial_accounts.coa_head_code` → `ac_coa`
- **Credit:** Showroom cash → resolved from predefined account `showroom_cash`

#### Journal Entry Logic

Simple two-line entry:
- Debit: Bank account (money goes into the bank)
- Credit: Showroom cash (money leaves the showroom cash box)

#### Example Data

**Scenario:** Showroom deposits ৳50,000 cash into bank account "Dutch-Bangla Ltd - Main Branch".

```
JV Number: JV-SBD-78
Voucher Date: 2024-01-25
Showroom: Dhaka Branch
Narration: Being showroom cash deposited into bank.

┌──────────────────────────────┬──────────┬──────────┐
│ Account                      │ Debit    │ Credit   │
├──────────────────────────────┼──────────┼──────────┤
│ Dutch-Bangla - Main Branch   │ 50,000.00│          │
│ Showroom Cash                │          │ 50,000.00│
├──────────────────────────────┼──────────┼──────────┤
│ TOTAL                        │ 50,000.00│ 50,000.00│
└──────────────────────────────┴──────────┴──────────┘
```

---

## 3. Common Patterns & Helpers

### 3.1 Shared Utility Methods

All journal voucher services implement these common methods:

| Method | Purpose |
|--------|---------|
| `toCents(value)` | Convert decimal to cents (× 100, round) |
| `fromCents(cents)` | Convert cents back to decimal |
| `toDateOnly(value)` | Extract YYYY-MM-DD from Date/string |
| `resolveAccountMap()` | Map account keys → COA records via predefined_accounts |
| `findFinancialYear()` | Find active financial year for voucher date |
| `findExistingVoucher()` | Check for duplicate voucher by reference_no |
| `createVoucherMaster()` | INSERT into ac_voucher_master |
| `createVoucherDetail()` | INSERT into ac_voucher_details |
| `assertBalanced()` | Verify total debits == total credits |

### 3.2 Error Handling

- Journal voucher failures are caught and logged as warnings but do NOT block the business operation
- Balanced voucher assertion throws `BadRequestException` if debits ≠ credits
- Missing predefined account config throws `BadRequestException` with the missing keys

### 3.3 Idempotency

- Each voucher is checked for duplicates via `findExistingVoucher()` using `reference_no`
- Sale voucher supports `replaceExisting` flag to allow re-posting when payments are updated
- Return vouchers are one-time only (no replace mechanism)

---

## 4. Database Schema Reference

### ac_voucher_master

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment ID |
| uuid | UUID | Unique identifier |
| fyear | INT | Financial year FK |
| vno | VARCHAR(50) | Voucher number (e.g. JV-BILL-001) |
| vtype | ENUM | JV/PV/RV/CV/DBV/CRV/BPV/BRV |
| vdate | DATE | Voucher date |
| reference_no | VARCHAR(50) | Business reference (sale bill number, return ID, etc.) |
| is_auto | BOOLEAN | true = system-generated |
| showroom_id | BIGINT | Showroom/warehouse FK |
| narration | VARCHAR(255) | Description text |
| status_id | BIGINT | Status FK (7 = Active) |
| is_reversal | BOOLEAN | Is this a reversal entry |
| exchange_rate | DECIMAL(18,6) | Currency exchange rate |
| currency_code | VARCHAR(10) | Default: BDT |

### ac_voucher_details

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment ID |
| voucher_id | BIGINT (FK) | Reference to voucher_master |
| coa_id | INT (FK) | Reference to ac_coa |
| line_number | INT | Sequence order |
| debit | DECIMAL(18,2) | Debit amount |
| credit | DECIMAL(18,2) | Credit amount |
| local_debit | DECIMAL(18,2) | Local currency debit |
| local_credit | DECIMAL(18,2) | Local currency credit |
| ledger_comment | VARCHAR(255) | Line description |

### ac_predefined_accounts

| Column | Type | Description |
|--------|------|-------------|
| account_key | VARCHAR | Logical key (e.g. `showroom_cash`) |
| key_head_code | INT | Maps to ac_coa.head_code |

---

## 5. Where Ledger Posting SHOULD Be Implemented

Based on the current implementation, the following modules are missing journal voucher posting:

### 5.1 Showroom Expenses (HIGH PRIORITY)

**Current Status:** The expense model (`pos_showroom_expenses`) exists but has **NO journal voucher posting**.

**What's needed:**
- When an expense is created with status `completed`, post a journal voucher
- Debit: Expense category account (e.g. `rent_expense`, `utility_expense`)
- Credit: `showroom_cash` (for cash payments) or bank account (for bank payments)

**Implementation pattern:** Create `src/modules/showroom-expense/showroom-expense-journal-voucher.service.ts` following the same pattern as the bank deposit service.

### 5.2 Showroom Cash Collection (MEDIUM PRIORITY)

**Current Status:** The `pos_showroom_cash_collections` table has a `voucher_id` FK to `ac_voucher_master`, but no journal voucher posting service was found.

**What's needed:**
- When cash collection is `accepted`, post a journal voucher
- Debit: `collection_receivable` or receiver account
- Credit: `showroom_cash`

### 5.3 Salary/Payroll (MEDIUM PRIORITY)

**Current Status:** HRMS salary modules exist with `accountsCalculationType`, `accountsBasicKey` fields but no ledger posting.

**What's needed:**
- When salary is disbursed, post a journal voucher
- Debit: Salary Expense
- Credit: Cash/Bank

### 5.4 Inventory Adjustments (LOW PRIORITY)

**Current Status:** Inventory operations (stock-in, stock-out, transfers) exist but have no financial posting.

**What's needed:**
- When stock is received from supplier, post inventory receipt voucher
- When stock is written off, post write-off voucher

---

## 6. Implementation Checklist for New Modules

To add journal voucher posting to any new module:

- [ ] Create predefined account keys in `ac_predefined_accounts` table
- [ ] Create journal voucher service file (e.g. `xxx-journal-voucher.service.ts`)
- [ ] Define account key constants
- [ ] Implement `buildJournalLines()` method
- [ ] Implement `resolveAccountMap()` (reuse pattern from existing services)
- [ ] Implement `postXxxVoucher()` public method
- [ ] Call the service from the business operation (within the same transaction)
- [ ] Wrap in try/catch to not block business operation on failure
- [ ] Register service in the NestJS module
- [ ] Add ledger entries to the corresponding report queries

---

## 7. Code References

| File | Line(s) | Purpose |
|------|---------|---------|
| `src/modules/pos-sale/pos-sale-journal-voucher.service.ts` | 83-228 | Sale voucher posting |
| `src/modules/pos-sale/pos-sale-journal-voucher.service.ts` | 268-395 | Build sale journal lines |
| `src/modules/pos-sale/pos-sale-return-journal-voucher.service.ts` | 65-308 | Sale return voucher posting |
| `src/modules/pos-sale/pos-sale-return-journal-voucher.service.ts` | 310-389 | Build return journal lines |
| `src/modules/showroom-bank-diposit/showroom-bank-diposit.service.ts` | 603-701 | Bank deposit voucher posting |
| `src/modules/pos-sale/pos-sale.service.ts` | 690, 879 | Calls sale voucher posting |
| `src/modules/pos-sale/websocket/services/pos-return.service.ts` | 381 | Calls return voucher posting |
| `src/database/models/accounts/coa/voucher/ac_voucher_master.model.ts` | Full | Voucher master model |
| `src/database/models/accounts/coa/voucher/ac_voucher_details.model.ts` | Full | Voucher details model |
| `src/database/models/accounts/ac_predefined_accounts.model.ts` | Full | Predefined account mapping |
| `src/database/enum/voucher.enum.ts` | Full | Voucher type enum |

---

## 8. Key Observations

1. **All automated postings use JV (Journal Voucher) type** — the system does not use PV/RV/CV/DBV/CRV/BPV/BRV for automated entries.

2. **Amount handling in cents** — All calculations use cents (value × 100) to avoid floating point precision issues.

3. **Voucher balance enforcement** — The `AcVoucherMaster` model has a `@BeforeSave` hook that validates total debits = total credits.

4. **Soft-delete support** — All voucher tables use `paranoid: true` for soft deletion.

5. **Financial year linkage** — Vouchers are automatically linked to the active financial year based on the voucher date.

6. **Showroom-level isolation** — Vouchers are tagged with `showroom_id` for per-showroom reporting.

7. **Idempotent by reference** — Duplicate vouchers are prevented by checking `reference_no` + `vtype` before creating.

---

*Report generated on: 2024*
*Project: garmentech-hrm-api-service*
