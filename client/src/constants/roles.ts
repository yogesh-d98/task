
export const UserRole = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];