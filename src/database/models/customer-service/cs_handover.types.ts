export enum HandoverStatus {
  UNDER_CONSTRUCTION = 'Under Construction',
  SCHEDULED = 'Scheduled',
  READY_FOR_SNAGGING = 'Ready for Snagging',
  SNAG_RECTIFICATION = 'Snag Rectification',
  READY_FOR_KEY_DELIVERY = 'Ready for Key Delivery',
  POSSESSION_TAKEN = 'Possession Taken',
  DLP_ACTIVE = 'DLP Active',
  HANDED_OVER = 'Handed Over',
}

export enum SnagSeverity {
  MINOR = 'Minor',
  MAJOR = 'Major',
  CRITICAL = 'Critical',
}

export enum SnagStatus {
  REPORTED = 'Reported',
  IN_RECTIFICATION = 'In Rectification',
  VERIFIED_BY_SITE_ENGR = 'Verified by Site Engr',
  CLIENT_SIGNED_OFF = 'Client Signed Off',
}
