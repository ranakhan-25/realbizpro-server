export enum PackagingDestination {
  DISTRIBUTION_TO_BRANCH = 'Distribution_to_Branch',
  DISTRIBUTION_TO_DISTRIBUTION = 'Distribution_to_Distribution',
  DISTRIBUTION_TO_GODOWN = 'Distribution_to_Godown',
  GODOWN_TO_DISTRIBUTION = 'Godown_to_Distribution',
  GODOWN_TO_GODOWN = 'Godown_to_Godown',
  DISTRIBUTION_TO_FINISHING = 'Distribution_to_Finishing',
  FINISHING_TO_DISTRIBUTION = 'Finishing_to_Distribution',
  FINISHING_TO_FINISHING = 'Finishing_to_Finishing',
  BRANCH_TO_DISTRIBUTION = 'Branch_to_Distribution',
  BRANCH_TO_BRANCH = 'Branch_to_Branch',
}

export enum ReferenceType {
  FINISHING_CHALLAN = 'finishing_challan',
  DISTRIBUTION_CHALLAN = 'distribution_challan',
  WAREHOUSE_CHALLAN = 'warehouse_challan',
  RECEIVING_CHALLAN = 'receiving_challan',
}

export enum PackagingType {
  CARTON = 'ctn', // Carton box (master carton)
  BAG = 'bag', // General bag
  BUNDLE = 'bundle', // Bundle packing
  BOSTA = 'bosta', // Woven sack / bag
  POLY = 'poly', // Polybag (single item packing)
  INNER = 'inner', // Inner pack
  ROLL = 'roll', // Fabric roll
  HANGER = 'hanger', // Hanging garments
  BOX = 'box', // Small box packing
}
