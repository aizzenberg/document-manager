export const ROLES = ['USER', 'REVIEWER'] as const;

export type Role = (typeof ROLES)[number];
