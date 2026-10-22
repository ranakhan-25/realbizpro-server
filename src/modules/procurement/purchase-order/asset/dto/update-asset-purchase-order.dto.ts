import { PartialType } from '@nestjs/swagger';
import { CreateAssetPurchaseOrderDto } from './create-asset-purchase-order.dto';
export class UpdateAssetPurchaseOrderDto extends PartialType(CreateAssetPurchaseOrderDto) {}
