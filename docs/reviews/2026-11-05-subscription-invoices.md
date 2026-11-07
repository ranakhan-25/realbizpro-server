# Code Review: Subscription Invoices (Super Admin and Organization Admin)

**Date:** 2026-11-05  
**Branch:** `sakib`  
**Verdict:** Approve  

---

## Summary of Changes

This change set introduces subscription invoice generation and download capabilities across both administrative tiers.

### Backend (`realbiz_pro_server`)
1. **Invoice Service (`src/modules/system/subscription-payments/invoice.service.ts`)**:
   - `getPaymentForInvoice(tranId)`: Queries `SysSubscriptionPayment` and joins `SysPlan`, `SysOrganization`, and `SysUser` models.
   - Throws `NotFoundException` if the transaction identifier is missing.
   - `generateInvoiceHtml(payment)`: Generates a self contained, styled, printable HTML invoice with branding, transaction details, billing duration, payment provider metadata, and a print trigger button.
2. **Controller (`src/modules/system/subscription-payments/subscription-payments.controller.ts`)**:
   - New endpoint `GET /subscription-payments/:tranId/invoice`.
   - Protected by `JwtAuthGuard` and `@ApiBearerAuth()`.
   - Supports both `format=html` (default, inline printable view) and `format=pdf` (Puppeteer A4 PDF stream).
3. **Module Registration (`src/modules/system/subscription-payments/subscription-payments.module.ts`)**:
   - Injects and exports `InvoiceService`.
4. **Unit Tests (`src/modules/system/subscription-payments/invoice.service.spec.ts`)**:
   - 4 test cases covering service definition, successful transaction lookup, not found error cases, and HTML invoice string output validation. All 4 passed.

### Frontend (`realbiz_pro`)
1. **API Service (`src/services/subscriptionPaymentService.ts`)**:
   - Added `getInvoiceUrl(tranId, format)` to dynamically resolve either the browser printable HTML route or the direct PDF download route.
2. **Shared Component (`src/components/modules/PaymentHistoryTable.tsx`)**:
   - Reusable table component displaying transaction records, amounts, billing cycle, status pill badges, and invoice action buttons (View HTML and Download PDF).
   - Filterable by transaction ID search and payment status (`VALID`, `PENDING`, `FAILED`, `CANCELLED`, `EXPIRED`).
   - Supports optional `organizationId` parameter to restrict records to a specific tenant or show all records for Super Admins.
3. **Super Admin Organization View (`src/app/(private)/admin/(admin-private)/organization/page.tsx`)**:
   - Embedded `PaymentHistoryTable` scoped to the active selected organization.
4. **Organization Admin Workspace (`src/app/(admin-dashbord)/dashboard/subscription-billing/page.tsx`)**:
   - Dedicated tenant billing page displaying active organization status cards, plan renewal trigger modal, and the payment history table with one click invoice access.

---

## Findings

### Blockers (0)
None.

### Major Findings (0)
None.

### Minor / Observations (0)
- The invoice endpoint gracefully falls back to inline HTML if Puppeteer fails or when format is omitted, ensuring zero client friction on mobile or restricted web views.
- TypeScript builds on both server and frontend complete with zero errors.
