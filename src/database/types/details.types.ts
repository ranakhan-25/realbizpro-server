// Auto-generated types for Details
// Source: src\database\models\projects\details\pr_details.model.ts

export interface DetailsAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  areaOfLand?: string | null;
  nameOfLandOwner?: string | null;
  landOwnerDeveloperRatio?: string | null;
  valueOfLand?: string | null;
  buildArea?: string | null;
  totalNoOfBuilding?: number | null;
  totalFloorOfBuilding?: number | null;
  noOfFlatInEachFloor?: number | null;
  totalFlatInTheBuilding?: number | null;
  flatSize?: string | null;
  totalNoOfCarParking?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface DetailsCreationAttributes {
  uid?: string | null;
  areaOfLand?: string | null;
  nameOfLandOwner?: string | null;
  landOwnerDeveloperRatio?: string | null;
  valueOfLand?: string | null;
  buildArea?: string | null;
  totalNoOfBuilding?: number | null;
  totalFloorOfBuilding?: number | null;
  noOfFlatInEachFloor?: number | null;
  totalFlatInTheBuilding?: number | null;
  flatSize?: string | null;
  totalNoOfCarParking?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type DetailsUpdateAttributes = Partial<DetailsCreationAttributes>;

// Helper type for including relations
export interface DetailsWithRelations extends DetailsAttributes {
  // No relations defined
}
