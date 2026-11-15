export type DocumentCategory =
  | 'Sale Agreement (Baina)'
  | 'Allotment Letter'
  | 'Power of Attorney (POA)'
  | 'KYC & NID Scans'
  | 'Possession Certificate'
  | 'Other';

export type DocumentVerificationStatus =
  | 'Pending Vetting'
  | 'Verified'
  | 'Signed & Executed'
  | 'Rejected';

export type DeedDraftStatus =
  | 'Draft Ready'
  | 'Vetting Complete'
  | 'Revision Requested';

export type RegistrationStatus =
  | 'Documents Gathering'
  | 'Drafting & Vetting'
  | 'Appointment Booked'
  | 'Registry Executed'
  | 'Original Deed Delivered';

export type MutationStage =
  | 'Application Submitted'
  | 'Kanungo/Surveyor Inquiry'
  | 'Hearing Scheduled'
  | 'DCR Payment Pending'
  | 'Khatian Approved'
  | 'Rejected';
