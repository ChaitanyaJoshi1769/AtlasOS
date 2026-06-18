import { Injectable } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  ANALYST = 'analyst',
  OPERATOR = 'operator',
}

export enum Permission {
  // Connector permissions
  CREATE_CONNECTOR = 'create_connector',
  READ_CONNECTOR = 'read_connector',
  UPDATE_CONNECTOR = 'update_connector',
  DELETE_CONNECTOR = 'delete_connector',

  // Dataset permissions
  CREATE_DATASET = 'create_dataset',
  READ_DATASET = 'read_dataset',
  UPDATE_DATASET = 'update_dataset',
  DELETE_DATASET = 'delete_dataset',

  // Pipeline permissions
  CREATE_PIPELINE = 'create_pipeline',
  READ_PIPELINE = 'read_pipeline',
  UPDATE_PIPELINE = 'update_pipeline',
  DELETE_PIPELINE = 'delete_pipeline',
  EXECUTE_PIPELINE = 'execute_pipeline',

  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_POLICIES = 'manage_policies',
}

@Injectable()
export class RBACService {
  private rolePermissions: Map<Role, Permission[]> = new Map([
    [
      Role.ADMIN,
      Object.values(Permission), // Admin has all permissions
    ],
    [
      Role.EDITOR,
      [
        Permission.CREATE_CONNECTOR,
        Permission.READ_CONNECTOR,
        Permission.UPDATE_CONNECTOR,
        Permission.CREATE_DATASET,
        Permission.READ_DATASET,
        Permission.UPDATE_DATASET,
        Permission.CREATE_PIPELINE,
        Permission.READ_PIPELINE,
        Permission.UPDATE_PIPELINE,
        Permission.EXECUTE_PIPELINE,
      ],
    ],
    [
      Role.VIEWER,
      [
        Permission.READ_CONNECTOR,
        Permission.READ_DATASET,
        Permission.READ_PIPELINE,
      ],
    ],
    [
      Role.ANALYST,
      [
        Permission.READ_CONNECTOR,
        Permission.READ_DATASET,
        Permission.READ_PIPELINE,
        Permission.CREATE_PIPELINE,
        Permission.EXECUTE_PIPELINE,
      ],
    ],
    [
      Role.OPERATOR,
      [
        Permission.READ_CONNECTOR,
        Permission.READ_PIPELINE,
        Permission.EXECUTE_PIPELINE,
      ],
    ],
  ]);

  hasPermission(role: Role, permission: Permission): boolean {
    const permissions = this.rolePermissions.get(role) || [];
    return permissions.includes(permission);
  }

  canPerformAction(role: Role, action: string, resource: string): boolean {
    const permission = `${action}_${resource}`.toUpperCase();
    const permissionEnum = Object.values(Permission).find(
      (p) => p === permission,
    );

    if (!permissionEnum) {
      return false;
    }

    return this.hasPermission(role, permissionEnum);
  }

  getRolePermissions(role: Role): Permission[] {
    return this.rolePermissions.get(role) || [];
  }

  getAvailableRoles(): Role[] {
    return Object.values(Role);
  }
}
