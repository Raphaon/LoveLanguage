export type Role = 'Patient' | 'Doctor' | 'Nurse' | 'Admin';

type Permission =
  | 'user:read:self'
  | 'user:update:self'
  | 'appointment:create'
  | 'appointment:update:self'
  | 'appointment:manage'
  | 'consultation:read'
  | 'consultation:write'
  | 'audit:read'
  | 'admin:manage';

export const rolePermissions: Record<Role, Permission[]> = {
  Patient: ['user:read:self', 'user:update:self', 'appointment:create', 'appointment:update:self', 'consultation:read'],
  Doctor: [
    'user:read:self',
    'user:update:self',
    'appointment:create',
    'appointment:manage',
    'consultation:read',
    'consultation:write'
  ],
  Nurse: ['user:read:self', 'user:update:self', 'consultation:read', 'appointment:manage'],
  Admin: ['user:read:self', 'user:update:self', 'appointment:manage', 'consultation:write', 'audit:read', 'admin:manage']
};

export const can = (role: Role, permission: Permission) => rolePermissions[role]?.includes(permission);
