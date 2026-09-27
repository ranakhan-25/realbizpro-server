export interface HmacClient {
  /**
   * Client Identifier
   * Example: ERP, POS, MOBILE
   */
  clientId: string;

  /**
   * Secret Key
   */
  secret: string;

  /**
   * Enable / Disable Client
   */
  active?: boolean;
}

export interface GenerateSignatureOptions {
  method: string;
  url: string;
  timestamp: string;
  nonce: string;
  body?: unknown;
  secret: string;
}

export interface SignedHeaders {
  'x-client-id': string;
  'x-timestamp': string;
  'x-nonce': string;
  'x-signature': string;
}
