import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HmacService {
  private readonly secret = 'MY_SUPER_SECRET_KEY';

  generateSignature(timestamp: string): string {
    return crypto
      .createHmac('sha512', this.secret)
      .update(timestamp)
      .digest('hex');
  }

  verifySignature(
    timestamp: string,
    signature: string,
  ): boolean {
    const expected =
      this.generateSignature(timestamp);

    const sig = Buffer.from(signature, 'hex');
    const exp = Buffer.from(expected, 'hex');

    if (sig.length !== exp.length) {
      return false;
    }

    return crypto.timingSafeEqual(sig, exp);
  }
}
