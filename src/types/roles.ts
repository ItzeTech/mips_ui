// types/roles.ts
export const ROLES = {
  MANAGER: 'Manager',
  BOSS: 'Boss',
  LAB_TECHNICIAN: 'Lab Technician',
  FINANCE_OFFICER: 'Finance Officer',
  STOCK_MANAGER: 'Stock Manager'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ALL_ROLES: Role[] = [
  ROLES.MANAGER,
  ROLES.BOSS,
  ROLES.LAB_TECHNICIAN,
  ROLES.FINANCE_OFFICER,
  ROLES.STOCK_MANAGER
];

export const ROLE_GROUPS = {
  ADMIN: [ROLES.MANAGER, ROLES.BOSS] as Role[],
  LAB: [ROLES.LAB_TECHNICIAN] as Role[],
  FINANCE: [ROLES.FINANCE_OFFICER] as Role[],
  STOCK: [ROLES.STOCK_MANAGER] as Role[],
  MANAGEMENT: [ROLES.MANAGER, ROLES.BOSS, ROLES.STOCK_MANAGER] as Role[],
  OPERATIONS: [ROLES.LAB_TECHNICIAN, ROLES.STOCK_MANAGER] as Role[],
  ALL: ALL_ROLES
} as const;