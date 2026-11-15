export enum DlpDefectCategory {
  WATER_SEEPAGE = 'Water Seepage',
  PLUMBING_DRAINAGE = 'Plumbing & Drainage',
  STRUCTURAL_CRACK = 'Structural Crack',
  ELECTRICAL_WIRING = 'Electrical & Wiring',
  DOORS_WINDOWS = 'Doors & Windows',
  TILES_FINISHING = 'Tiles & Finishing',
  OTHER = 'Other',
}

export enum DlpSeverity {
  CRITICAL_STRUCTURAL = 'Critical Structural',
  MAJOR = 'Major',
  MINOR = 'Minor',
}

export enum DlpClaimStatus {
  CLAIM_LOGGED = 'Claim Logged',
  SITE_INSPECTED = 'Site Inspected',
  RECTIFICATION_IN_PROGRESS = 'Rectification in Progress',
  RESOLVED_SIGNED_OFF = 'Resolved & Signed Off',
}

export enum MaintenanceType {
  PREVENTIVE = 'Preventive',
  EMERGENCY_BREAKDOWN = 'Emergency Breakdown',
  STATUTORY_ANNUAL = 'Statutory Annual',
  ROUTINE_SERVICE = 'Routine Service',
}

export enum MaintenanceStatus {
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  PENDING_PARTS = 'Pending Parts',
}

export enum AssociationGovernanceStatus {
  DEVELOPER_MANAGING = 'Developer Managing',
  AD_HOC_COMMITTEE = 'Ad-hoc Committee',
  FORMALLY_HANDED_OVER = 'Formally Handed Over to OA',
}
