export const HMAC_AUTH = 'HMAC_AUTH';

export const HMAC_EXPIRE_TIME = 60 * 60 * 1000; // 1 hour

export const HMAC_HEADERS = {
  TIMESTAMP: 'x-timestamp',
  SIGNATURE: 'x-signature',
} as const;
