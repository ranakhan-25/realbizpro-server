export type SecurityCompanyStatus =
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'TERMINATED';

export type GuardSource = 'IN_HOUSE' | 'COMPANY';

export type GuardStatus =
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'INACTIVE'
  | 'TERMINATED';

export type ShiftName = 'Morning' | 'Evening' | 'Night' | 'Custom';

export type RosterStatus =
  | 'SCHEDULED'
  | 'ON_DUTY'
  | 'COMPLETED'
  | 'ABSENT'
  | 'RELIEVED';

export type VisitorPurpose =
  | 'Delivery'
  | 'Guest / Personal'
  | 'Contractor / Maintenance'
  | 'Official / Courier'
  | 'Other';

export type VisitorStatus = 'CHECKED_IN' | 'CHECKED_OUT';

