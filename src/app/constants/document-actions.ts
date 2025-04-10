export const DOCUMENT_ACTION_TYPES = [
  'ADD',
  'VIEW',
  'REVOKE',
  'DELETE',
  'CHANGE_NAME',
  'CHANGE_STATUS',
] as const;

export type DocumentActionType = (typeof DOCUMENT_ACTION_TYPES)[number];


