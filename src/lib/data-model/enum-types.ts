// User Roles with object-based enum pattern
export const UserRoles = {
  // SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  // MANAGER: "MANAGER",
  USER: "USER",
} as const;

// Extract types from the objects
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const USER_ROLES = Object.values(UserRoles);

// Type guards for runtime validation
export const isUserRole = (value: string): value is UserRole => {
  return Object.values(UserRoles).includes(value as UserRole);
};
