# Code Review: Public Self-Service Tenant Registration & Subscription Checkout

**Date:** 2026-11-05  
**Branch:** `sakib`  
**Verdict:** Approve  

---

## Scope of Review

This review covers the public self-service tenant onboarding workflow, resolving the issue where unauthenticated visitors clicking "Get Started" on `/pricing` were redirected to the `/login` route.

### Backend (`realbiz_pro_server`)
1. **Public Checkout Endpoint (`src/modules/system/subscription-payments/subscription-payments.controller.ts`)**:
   - `POST /subscription-payments/public-checkout` decorated with `@Public()`.
   - Allows unauthenticated onboarding while preserving full input validation via `PublicCheckoutDto`.
2. **Service Transaction (`src/modules/system/subscription-payments/subscription-payments.service.ts`)**:
   - `publicCheckout(dto)`:
     - Duplicate email/username collision check.
     - Auto-generation of unique tenant identifier codes (e.g., `ORG_ACME_XXXX`).
     - Atomic transaction across `SysOrganization`, `SysUser`, and `SysUserRole`.
     - Free/Trial plan path: instantly activates tenant and prompts user to log in.
     - Paid plan path: initiates SSLCommerz gateway session and returns `gatewayUrl` for direct checkout redirection.
3. **Payment Completion Hook**:
   - `processPaymentSuccess` marks pending user accounts `isActive = true` immediately upon gateway IPN confirmation.

### Frontend (`realbiz_pro`)
1. **Public Registration Modal (`src/components/pricing/PublicTenantRegisterModal.tsx`)**:
   - Captures company name, administrator name, work email, phone, and password.
   - Formats plan summary and billing cycle dynamically.
   - Submits payload to `/subscription-payments/public-checkout` and smoothly transfers the user to SSLCommerz or the login portal.
2. **Pricing Page (`src/components/pricing/pricing-client.tsx`)**:
   - Replaced static `/login` link with interactive modal state trigger.
   - Preserves active billing toggle (`monthly` / `yearly`).
   - Clean TypeScript typing via `PricingPlanItem` interface.

---

## Findings

### Blockers (0)
None.

### Major Findings (0)
None.

### Minor / Observations (0)
- Endpoints and services compile cleanly with zero TypeScript errors on both repositories.
- Unit tests for invoice and payment services execute successfully.
