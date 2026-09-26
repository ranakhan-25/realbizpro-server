import { ReferenceType } from '@/database/enum/packaging.enum';
import { Transaction } from 'sequelize';

export interface GetChallanItemQuantityParams {
  referenceType: ReferenceType;
  referenceId: number;
  barcodeId: number;
  transaction: Transaction;
}

export interface GetPackedQuantityParams {
  referenceType: ReferenceType;
  referenceId: number;
  barcodeId: number;
  productId: number;
  currentPackagingItemId?: number;
  transaction: Transaction;
}

export interface PackedQuantityResult {
  already_packed_qty: number | null;
}

export interface FinishingChallanRaw {
  id: number;
  challanNumber: string;
  challanDate: Date;
  challanQuantity: number;
}

export interface FinishingChallanItemOption {
  productId: number;
  productName: string;
  barcodeId: number;
  productCode: string;
  quantity: number;
  packed: number;
  remaining: number;
}

export interface FinishingChallanDropdownOption {
  value: number;
  label: string;
  challanNumber: string;
  date: Date | string;
  challanQuantity: number;
  totalRemaining: number;
  items: FinishingChallanItemOption[];
}
