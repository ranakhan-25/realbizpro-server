// Auto-generated types for MaterialRequisitionItem
// Source: src\database\models\projects\material-requisition-item\pr_material_requisition_item.model.ts

import type { MaterialRequisition } from '../models/projects/material-requisition/pr_material_requisition.model';

export interface MaterialRequisitionItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  materialRequisitionId: string;
  itemCode: string;
  itemName?: string | null;
  details?: string | null;
  unit?: string | null;
  budgetQty: number | null;
  alreadyPurchaseQty: number | null;
  availableQty: number | null;
  demandQty: number | null;
  stock: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  materialRequisition?: MaterialRequisition;
}

export interface MaterialRequisitionItemCreationAttributes {
  materialRequisitionId: string;
  itemCode: string;
  itemName?: string | null;
  details?: string | null;
  unit?: string | null;
  budgetQty?: number | null; // Has default value
  alreadyPurchaseQty?: number | null; // Has default value
  availableQty?: number | null; // Has default value
  demandQty?: number | null; // Has default value
  stock?: number | null; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type MaterialRequisitionItemUpdateAttributes = Partial<MaterialRequisitionItemCreationAttributes>;

// Helper type for including relations
export interface MaterialRequisitionItemWithRelations extends MaterialRequisitionItemAttributes {
  materialRequisition?: MaterialRequisition;
}
