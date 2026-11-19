export enum CommChannel {
  SMS = 'SMS',
  EMAIL = 'Email',
  WHATSAPP = 'WhatsApp',
  CALL = 'Call',
}

export enum CommType {
  PAYMENT_REMINDER = 'Payment Reminder',
  CONSTRUCTION_MILESTONE = 'Construction Milestone',
  HANDOVER_INVITE = 'Handover Invite',
  DLP_UPDATE = 'DLP Update',
  LEGAL_NOTICE = 'Legal Notice',
  GENERAL_ANNOUNCEMENT = 'General Announcement',
}

export enum CommStatus {
  DELIVERED = 'Delivered',
  READ = 'Read',
  SENT = 'Sent',
  SCHEDULED = 'Scheduled',
  FAILED = 'Failed',
}

export enum VisitPurpose {
  MILESTONE_INSPECTION = 'Milestone Inspection',
  SNAGGING_WALKTHROUGH = 'Snagging Walkthrough',
  HANDOVER_WALKTHROUGH = 'Handover Walkthrough',
  INTERIOR_FIT_OUT = 'Interior Fit-out',
  GENERAL_VISIT = 'General Visit',
}

export enum VisitStatus {
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  RESCHEDULED = 'Rescheduled',
  CANCELLED = 'Cancelled',
}

export enum SurveyType {
  HANDOVER_CSAT = 'Handover CSAT',
  CONSTRUCTION_UPDATE = 'Construction Update',
  DLP_RESOLUTION = 'DLP Resolution',
  PRE_SALES_TO_POST_SALES = 'Pre-Sales to Post-Sales',
  GENERAL_SERVICE = 'General Service',
}

export enum NpsCategory {
  PROMOTER = 'Promoter',
  PASSIVE = 'Passive',
  DETRACTOR = 'Detractor',
}

export enum FeedbackFollowUpStatus {
  SATISFIED_CLOSED = 'Satisfied - Closed',
  PENDING_REVIEW = 'Pending Review',
  ESCALATED_TO_CX_HEAD = 'Escalated to CX Head',
  ACTION_TAKEN = 'Action Taken',
}
