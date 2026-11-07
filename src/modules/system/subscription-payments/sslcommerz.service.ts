import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface SslcommerzInitiateParams {
  totalAmount: number;
  currency?: string;
  tranId: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  productName: string;
  productCategory?: string;
}

export interface SslcommerzValidationResponse {
  status: string; // 'VALID', 'VALIDATED', 'FAILED', 'INVALID_TRANSACTION'
  tran_date?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  currency?: string;
  bank_tran_id?: string;
  card_type?: string;
  card_no?: string;
  card_issuer?: string;
  card_brand?: string;
  card_issuer_country?: string;
  currency_type?: string;
  currency_amount?: string;
  currency_rate?: string;
  base_fair?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  risk_level?: string;
  risk_title?: string;
  error?: string;
}

@Injectable()
export class SslcommerzService {
  private readonly logger = new Logger(SslcommerzService.name);

  private readonly storeId: string;
  private readonly storePasswd: string;
  private readonly isSandbox: boolean;
  private readonly initUrl: string;
  private readonly validatorUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.storeId =
      this.configService.get<string>('SSLCOMMERZ_STORE_ID') || 'testbox';
    this.storePasswd =
      this.configService.get<string>('SSLCOMMERZ_STORE_PASSWORD') || 'qwerty';
    this.isSandbox =
      this.configService.get<string>('SSLCOMMERZ_IS_SANDBOX') !== 'false';

    this.initUrl = this.isSandbox
      ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

    this.validatorUrl = this.isSandbox
      ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
      : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

    this.logger.log(
      `SSLCommerz Initialized [Store: ${this.storeId}, Sandbox: ${this.isSandbox}]`,
    );
  }

  async initiatePaymentSession(
    params: SslcommerzInitiateParams,
  ): Promise<{
    status: string;
    gatewayUrl?: string;
    sessionkey?: string;
    failedreason?: string;
  }> {
    const payload = new URLSearchParams({
      store_id: this.storeId,
      store_passwd: this.storePasswd,
      total_amount: Number(params.totalAmount).toFixed(2),
      currency: params.currency || 'BDT',
      tran_id: params.tranId,
      success_url: params.successUrl,
      fail_url: params.failUrl,
      cancel_url: params.cancelUrl,
      ipn_url: params.ipnUrl,
      cus_name: params.customerName || 'Valued Customer',
      cus_email: params.customerEmail || 'billing@example.com',
      cus_add1: params.customerAddress || 'Dhaka',
      cus_city: params.customerCity || 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: params.customerPhone || '01700000000',
      shipping_method: 'NO',
      product_name: params.productName || 'Subscription Package',
      product_category: params.productCategory || 'Subscription',
      product_profile: 'non-physical-goods',
    });

    this.logger.log(
      `Initiating SSLCommerz Session for TXN ${params.tranId} Amount ${params.totalAmount} BDT`,
    );

    try {
      const response = await axios.post(this.initUrl, payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 20000,
      });

      const data = response.data;

      if (data?.status === 'SUCCESS' && data?.GatewayPageURL) {
        return {
          status: 'SUCCESS',
          gatewayUrl: data.GatewayPageURL,
          sessionkey: data.sessionkey,
        };
      }

      this.logger.error(
        `SSLCommerz session initialization failed: ${data?.failedreason || JSON.stringify(data)}`,
      );
      return {
        status: 'FAILED',
        failedreason: data?.failedreason || 'Gateway initialization failed',
      };
    } catch (error: any) {
      this.logger.error(
        `SSLCommerz HTTP error: ${error?.message || error}`,
        error?.stack,
      );
      throw error;
    }
  }

  async validateTransaction(
    valId: string,
  ): Promise<SslcommerzValidationResponse> {
    this.logger.log(`Validating SSLCommerz transaction val_id: ${valId}`);

    try {
      const response = await axios.get<SslcommerzValidationResponse>(
        this.validatorUrl,
        {
          params: {
            val_id: valId,
            store_id: this.storeId,
            store_passwd: this.storePasswd,
            v: 1,
            format: 'json',
          },
          timeout: 15000,
        },
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to validate SSLCommerz transaction val_id ${valId}: ${error?.message || error}`,
      );
      throw error;
    }
  }
}
