# 0002. SSLCommerz Payment Gateway Integration for Tenant Subscriptions

**Date**: 2026-11-05  
**Status**: Accepted  

## Summary

This decision defines how our enterprise platform connects with the SSLCommerz payment gateway to collect tenant subscription payments using their demo sandbox environment. When an organization administrator chooses to renew or upgrade their subscription plan, our backend generates an official payment session and redirects the user to SSLCommerz to complete the payment via bKash, Nagad, bank cards, or internet banking. Once payment finishes, our backend verifies the authenticity of the transaction through a dual verification mechanism (browser return callback plus server to server Instant Payment Notification) and automatically extends the organization subscription dates. This protects our system from client tampering, prevents duplicate extensions, and gives tenants a seamless checkout experience.

## Context

Our application operates as a multi tenant enterprise resource planning platform where organizations subscribe to monthly, quarterly, or yearly packages. Currently, subscriptions must be updated manually by a Super Admin in the database or admin interface, which limits self service onboarding and scale.

To automate subscription collection in Bangladesh, we need to integrate with a licensed local payment aggregator. SSLCommerz is the leading payment gateway in Bangladesh supporting mobile financial services (bKash, Nagad, Rocket, Upay), major debit and credit cards (Visa, Mastercard, Amex), and direct internet banking.

Allowing browser redirects to handle financial settlement introduces serious security risks if not designed with extreme care. Malicious actors could attempt to forge success parameters, replay payment callbacks, or manipulate the payment amount in browser payloads. We must build a zero trust payment architecture where client browsers cannot dictate prices, transactions are validated directly with SSLCommerz server to server endpoints, and subscriptions renew with strict idempotency (performing an operation multiple times without changing the result beyond the initial application).

## Requirements

**User stories**:
* As an Organization Admin, I want to review my subscription package, choose a renewal cycle, and pay through local mobile banking or cards so that my company account remains active without manual paperwork.
* As an Organization Admin, I want to see real time payment receipts and immediate confirmation once my transaction succeeds so that my team can continue working without disruption.
* As a Super Admin, I want all gateway transactions logged with full audit details and SSLCommerz validation IDs so that finance can reconcile bank settlements accurately.

**Acceptance criteria**:
* **AC-1**: When an organization administrator initiates a subscription checkout, the backend retrieves the authoritative package price directly from the database, enforces currency in Bangladeshi Taka (BDT), and refuses any amount or price passed from the frontend browser.
* **AC-2**: The backend creates a pending transaction record with a unique transaction identifier before contacting SSLCommerz, and successfully redirects the user to the official SSLCommerz sandbox payment gateway URL.
* **AC-3**: When a payment succeeds, the backend verifies the transaction with the SSLCommerz Order Validation API directly using server to server communication, confirming that the amount, currency, transaction identifier, and status match the database record before updating any subscription.
* **AC-4**: Subscription activation is strictly idempotent, meaning if both the browser return callback and the server Instant Payment Notification arrive concurrently, the system extends the organization subscription end date exactly once.
* **AC-5**: If a payment fails, is cancelled by the user, or gets declined by the bank, the transaction status updates to FAILED or CANCELLED, no subscription dates change, and a clear explanatory message appears on the tenant billing dashboard.
* **AC-6**: Any pending transaction that receives neither a success callback nor an Instant Payment Notification within thirty minutes is automatically marked as abandoned by a background reconciliation routine.

## Options considered

### Option 1: Client Initiated Hosted Checkout with Dual Verification (Recommended)

The frontend sends only the chosen plan identifier and billing cycle to the backend. The backend resolves the price from the database, logs a pending payment record, requests a session from SSLCommerz, and returns the gateway redirect URL. When the user finishes payment, SSLCommerz triggers both a browser return callback and a server to server Instant Payment Notification (IPN). Whichever hits first locks the transaction record, calls the SSLCommerz Order Validation API to verify authenticity, and safely extends the tenant subscription dates.

**Pros**:
* Highest security posture because client browsers cannot manipulate monetary amounts.
* Protects against lost payments if a user closes their browser before returning (the server IPN still settles the transaction).
* Keeps payment data and credentials isolated outside our application servers, reducing regulatory compliance burden.

**Cons**:
* Requires public webhook reachability (or an HTTP tunnel like ngrok during local sandbox development).

### Option 2: Browser Return Only Verification

The application relies solely on the browser redirect callback to the success URL to trigger validation and update the subscription.

**Pros**:
* Simpler to test on local development machines without configuring webhooks or tunnels.

**Cons**:
* Vulnerable to lost payments if the customer loses network connection, closes the tab, or has an aggressive browser ad blocker blocking the redirect.
* Fails enterprise reliability standards for automated billing.

### Option 3: Embedded Iframe Gateway Modal

The SSLCommerz checkout page renders inside an iframe modal overlay directly inside our application dashboard.

**Pros**:
* The customer never leaves our website domain visually.

**Cons**:
* Many Bangladeshi banks block iframe embedding using HTTP security headers (X Frame Options and Content Security Policy) during two factor authentication (SMS OTP), causing checkout white screens and broken transactions.
* Poor user experience on mobile web screens.

## Decision

**Chosen option**: Option 1: Client Initiated Hosted Checkout with Dual Verification.

We will implement a secure hosted redirect checkout where the backend controls all pricing logic, stores pending records, and validates transactions server to server via both the return callback and the Instant Payment Notification (IPN).

## Rationale

Financial transactions require zero trust architecture. Allowing client side code to provide prices or trusting unverified browser redirects invites fraud. Option 1 ensures that every single taka received is verified against the SSLCommerz central validation server before any subscription entitlements are granted. Furthermore, combining the browser return with the background Instant Payment Notification guarantees that customers who pay via mobile banking (such as bKash or Nagad) will have their accounts activated even if their mobile browser drops connection right after entering their PIN.

## Feature design

**Data model sketch**:

A new model and database table `sys_subscription_payments` (table name `sys_subscription_payments`) will be created:

* `id`: BIGINT, primary key, auto increment
* `uuid`: UUID, unique identifier
* `organization_id`: BIGINT, foreign key pointing to `sys_organizations.id`, required
* `plan_id`: BIGINT, foreign key pointing to `sys_plans.id`, required
* `user_id`: BIGINT, foreign key pointing to `sys_users.id`, required (the user who initiated payment)
* `tran_id`: VARCHAR(100), unique transaction identifier (format: `TXN_timestamp_random`), required, indexed
* `val_id`: VARCHAR(100), SSLCommerz validation identifier, nullable, indexed
* `amount`: DECIMAL(12, 2), numeric charge amount, required
* `currency`: VARCHAR(10), default `BDT`, required
* `billing_cycle`: VARCHAR(20), values `monthly`, `quarterly`, `half_yearly`, `yearly`, required
* `duration_days`: INTEGER, subscription duration in days to credit upon success, required
* `status`: VARCHAR(30), values `PENDING`, `VALID`, `FAILED`, `CANCELLED`, `EXPIRED`, default `PENDING`
* `bank_tran_id`: VARCHAR(100), bank transaction reference, nullable
* `card_type`: VARCHAR(100), payment channel used (such as `BKASH-BKash`, `NAGAD-Nagad`, `VISA-Dutch Bangla Bank`), nullable
* `card_brand`: VARCHAR(50), brand name, nullable
* `gateway_response`: JSONB, complete raw payload returned by SSLCommerz validation for auditing
* `payment_initiated_at`: TIMESTAMP, when user began checkout
* `payment_completed_at`: TIMESTAMP, when gateway confirmed success
* `created_at`, `updated_at`, `deleted_at`: standard timestamps

**State transitions**:

```
[User initiates checkout] 
           │
           ▼
        PENDING ──────────────(User cancels)─────────────► CANCELLED
           │
           ├──────────────(Payment fails or declined)────► FAILED
           │
           ├──────────────(30 min timeout / no return)───► EXPIRED
           │
           ▼ (Validation API confirms 'VALID')
         VALID
           │
           ▼
[Extend sys_organizations dates]
```

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| /realbizpro/api/v1/payments/subscriptions/initiate | POST | planId (number, req), billingCycle (string, req) | gatewayUrl (string), tranId (string) | Bearer (Tenant Admin) | 400 bad input, 404 plan missing, 502 gateway error |
| /realbizpro/api/v1/payments/subscriptions/success | POST | tran_id, val_id, amount, card_type, status | HTML redirect to frontend billing page | Public (Gateway Callback) | 400 invalid signature, 404 record missing |
| /realbizpro/api/v1/payments/subscriptions/fail | POST | tran_id, status, error | HTML redirect to frontend billing page | Public (Gateway Callback) | 400 bad input |
| /realbizpro/api/v1/payments/subscriptions/cancel | POST | tran_id, status | HTML redirect to frontend billing page | Public (Gateway Callback) | 400 bad input |
| /realbizpro/api/v1/payments/subscriptions/ipn | POST | tran_id, val_id, amount, status, verify_sign | status (string: OK) | Public (SSLCommerz IPN) | 400 bad payload, 422 mismatch |
| /realbizpro/api/v1/payments/subscriptions/history | GET | page (opt), limit (opt) | payments list, pagination meta | Bearer (Tenant Admin) | 401 unauthorized |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Initiate Payment Session | `amount` | Read directly from `sys_plans` database table (`monthly_price` or `yearly_price`) based on `billingCycle` |
| Initiate Payment Session | `currency` | Hardcoded to `BDT` for Bangladeshi payment channels |
| Initiate Payment Session | `tran_id` | Server generated cryptographic timestamp and random string |
| Initiate Payment Session | `customer_name`, `customer_email`, `customer_phone` | Current authenticated user profile and organization records |
| Payment Validation | `val_id` | Supplied by SSLCommerz upon customer authorization |
| Payment Validation | `verified_amount` | Returned by SSLCommerz Order Validation API |
| Subscription Extension | `duration_days` | Stored in `sys_plans.duration_days` or derived from `billingCycle` |
| Subscription Extension | `subscription_end_date` | Computed as `GREATEST(current_end_date, now()) + duration_days` |

**Key invariants**:

* The client frontend must never provide the monetary amount; the backend calculates all fees from authoritative plan records.
* The system must never extend subscription dates without a successful HTTP status and `status === 'VALID'` response from the SSLCommerz Order Validation endpoint.
* Once a payment record moves to `VALID`, subsequent callback or IPN requests must return success immediately without modifying subscription dates again.
* The currency passed to SSLCommerz must strictly be `BDT`. If a package is configured with a dollar symbol, its numeric value is treated directly as BDT for this gateway.

**Security model**:

* Initiation endpoints require valid JSON Web Token authentication with Tenant Admin or Super Admin privileges.
* The success, fail, cancel, and IPN callback routes are public endpoints because SSLCommerz servers post data to them directly from external networks.
* To protect against forged posts, the backend never trusts post parameters alone; it immediately initiates an outbound HTTPS request from our backend to the SSLCommerz validation API using our private store password (`store_passwd`) before trusting any payment outcome.
* SSLCommerz store credentials (`STORE_ID` and `STORE_PASSWD`) reside strictly in server environment variables and are never exposed to the frontend.

**Configuration required**:

* `SSLCOMMERZ_STORE_ID`: Merchant store identifier provided by SSLCommerz (use demo store `testbox` for sandbox).
* `SSLCOMMERZ_STORE_PASSWORD`: Merchant store password provided by SSLCommerz.
* `SSLCOMMERZ_IS_SANDBOX`: Boolean flag (`true` for sandbox, `false` for live production).
* `SSLCOMMERZ_INIT_URL`: `https://sandbox.sslcommerz.com/gwprocess/v4/api.php`
* `SSLCOMMERZ_VALIDATION_URL`: `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php`
* `SSLCOMMERZ_SUCCESS_URL`: Backend callback URL for success redirects.
* `SSLCOMMERZ_FAIL_URL`: Backend callback URL for failure redirects.
* `SSLCOMMERZ_CANCEL_URL`: Backend callback URL for cancellation redirects.
* `SSLCOMMERZ_IPN_URL`: Backend webhook listener for background Instant Payment Notifications.
* `APP_FRONTEND_URL`: Client dashboard URL where the user is returned after backend callback processing (for example, `http://localhost:3000/admin/organization`).

**Critical test scenarios**:

* Happy path: Customer chooses Professional Plan with yearly cycle, completes bKash payment in SSLCommerz sandbox, returns to application, and subscription end date extends by 365 days with active status; verifies **AC-1**, **AC-2**, **AC-3**, **AC-4**.
* Tampering prevention: Attacker sends an HTTP POST to the success callback with a fabricated transaction identifier and valid status without paying; backend validation check fails, no database changes occur, and the attempt is logged; verifies **AC-3**.
* Concurrency and idempotency: SSLCommerz IPN and customer browser return hit the server within milliseconds of each other; database row lock guarantees only one worker executes the extension while the second worker exits safely; verifies **AC-4**.
* User cancellation: Customer opens the gateway, clicks the cancel button, returns to billing page, and sees an informational notification while existing subscription status remains unchanged; verifies **AC-5**.
* Network drop recovery: Customer completes mobile payment, but their browser tab crashes before reaching the return URL; SSLCommerz server delivers background IPN, which validates the charge and activates the subscription seamlessly; verifies **AC-3**, **AC-4**.

## Build plan

1. Create database model and migration for `sys_subscription_payments` with foreign keys to `sys_organizations`, `sys_plans`, and `sys_users`; satisfies **AC-1**, **AC-2**.
2. Create dedicated `SslcommerzService` in NestJS backend to encapsulate session initialization and outbound server Order Validation API calls using sandbox credentials; satisfies **AC-1**, **AC-2**, **AC-3**.
3. Create `SubscriptionPaymentsService` and `SubscriptionPaymentsController` implementing checkout initiation, browser callbacks (success, fail, cancel), and IPN webhook listener; satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**.
4. Implement database transaction locking on `sys_subscription_payments` and `sys_organizations` to guarantee idempotent subscription extension; satisfies **AC-4**.
5. Add automated background cron job to expire stale pending transactions older than thirty minutes; satisfies **AC-6**.
6. Create frontend checkout modal and subscription billing UI in the tenant administrative portal allowing admins to pick cycles, review pricing in BDT, and trigger redirect; satisfies **AC-1**, **AC-2**, **AC-5**.
7. Test end to end checkout in SSLCommerz sandbox using test cards, bKash simulator, and IPN simulation; satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**.

## Consequences

**Positive**:
* Enables fully automated, self service subscription renewals and upgrades for all Bangladeshi clients.
* Eradicates human delay and manual administrative workload in extending subscriptions.
* Strict server to server validation stops all common payment fraud and price tampering attacks.
* Dual verification guarantees zero lost payments when mobile browsers lose connection.

**Negative / tradeoffs**:
* Requires configuring public webhook tunneling (such as ngrok or cloudflare tunnel) during local development to receive SSLCommerz IPN callbacks.
* SSLCommerz does not support automated recurring card debits out of the box without specialized enterprise bank merchant agreements, so billing remains manual periodic checkout.

**Neutral**:
* Package amounts configured in dollar signs will be billed as equivalent numeric Bangladeshi Taka until a multi currency exchange layer is introduced.
