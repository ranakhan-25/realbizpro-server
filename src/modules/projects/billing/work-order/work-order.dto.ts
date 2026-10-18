import { Allow } from 'class-validator';

export class WorkOrderDto {
  @Allow() declare title: string;
  @Allow() declare date: string;
  @Allow() declare recordDate: string;
  @Allow() declare code: string;
  @Allow() declare customerId?: string;
  @Allow() declare clientOrderNo?: string;
  @Allow() declare projectTypeId?: string;
  @Allow() declare projectId: string;
  @Allow() declare siteId?: string;
  @Allow() declare attachment?: string;
  @Allow() declare poNo?: string;
  @Allow() declare categoryId?: string;
  @Allow() declare subCategoryId?: string;
  @Allow() declare items: Array<Record<string, unknown>>;
  @Allow() declare subtotal: number;
  @Allow() declare vatPercent: number;
  @Allow() declare vatInclude: boolean;
  @Allow() declare vatAmount: number;
  @Allow() declare aitPercent: number;
  @Allow() declare aitInclude: boolean;
  @Allow() declare aitAmount: number;
  @Allow() declare grandTotal: number;
  @Allow() declare amount: number;
  @Allow() declare details: Record<string, unknown>;
}
