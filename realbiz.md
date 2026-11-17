# Subscription Payment Overview

## How the payment works
When a customer chooses a subscription plan the front end calls the server to create a payment transaction. The server stores the transaction and contacts the SSLCommerz sandbox to get a payment URL. The URL is sent back to the browser and the customer is redirected to SSLCommerz. After the customer finishes the checkout SSLCommerz calls the IPN endpoint of our application. The endpoint validates the response with SSLCommerz and, if the payment is confirmed, marks the transaction as successful and activates the organization’s subscription.

## Purpose of the payment
The payment is used to unlock access to the premium features of the platform for the organization that the customer belongs to. A successful payment creates or extends the subscription period for that organization.

## Permissions and security checks
All subscription‑payment routes are protected by `JwtAuthGuard`, which requires a valid JWT bearer token. The guard ensures that only authenticated users can call the endpoints.

The service also verifies ownership of the organization before it creates or updates a transaction. It checks that the `organizationId` in the request belongs to the user identified by the JWT. Database row locks are used to guarantee idempotent updates and to prevent race conditions.

The IPN validation step uses a signed request to SSLCommerz and a short timeout to avoid hanging. Any mismatch or failure results in the transaction being marked as failed.
