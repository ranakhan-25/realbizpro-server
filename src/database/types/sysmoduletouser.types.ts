// Auto-generated types for SysModuleToUser
// Source: src\database\models\system\sys_module_to_user.model.ts

export interface SysModuleToUserAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  moduleId: number;
  userId: number;
}

export interface SysModuleToUserCreationAttributes {
  moduleId: number;
  userId: number;
}

export type SysModuleToUserUpdateAttributes = Partial<SysModuleToUserCreationAttributes>;

// Helper type for including relations
export interface SysModuleToUserWithRelations extends SysModuleToUserAttributes {
  // No relations defined
}
