// Auto-generated types for DemoBook
// Source: src/database/models/system/sys_demo_book.model.ts

export interface DemoBookAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationName: string;
  organizationLocation: string;
  organizationEmail: string;
  organizationYear: number;
  demoDate: string;
  contactPersonName: string;
  meetingTime?: string | null;
  tradeLicense: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface DemoBookCreationAttributes {
  organizationName: string;
  organizationLocation: string;
  organizationEmail: string;
  organizationYear: number;
  demoDate: string;
  contactPersonName: string;
  meetingTime?: string | null;
  tradeLicense: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type DemoBookUpdateAttributes = Partial<DemoBookCreationAttributes>;

// Helper type for including relations
export interface DemoBookWithRelations extends DemoBookAttributes {
  // No relations defined
}
