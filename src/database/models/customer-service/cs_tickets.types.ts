export enum TicketCategory {
  CIVIL_WORK = 'Civil Work',
  SANITARY_PLUMBING = 'Sanitary & Plumbing',
  ELECTRICAL = 'Electrical',
  FINISHING_TILES = 'Finishing & Tiles',
  ACCOUNTS_BILLING = 'Accounts & Billing',
  HANDOVER_DELAY = 'Handover Delay',
  OTHER = 'Other',
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  PENDING_CUSTOMER = 'Pending Customer',
  ESCALATED = 'Escalated',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  REOPENED = 'Reopened',
}

export interface TicketReplyItem {
  id: string;
  sender_id?: number | null;
  sender: string;
  role: string;
  message: string;
  timestamp: string;
}
