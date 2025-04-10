export const DOCUMENT_STATUSES = [
  'DRAFT',
  'REVOKE',
  'READY_FOR_REVIEW',
  'UNDER_REVIEW',
  'APPROVED',
  'DECLINED',
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];
