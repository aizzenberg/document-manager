import { SortDirection } from '@angular/material/sort';
import { DocumentAction } from '../app/constants/document-actions';
import { DocumentStatus } from '../app/constants/document-statuses';
import { Role } from '../app/constants/roles';

export interface GetDocumentsResponse<> {
  results: Document[];
  count: number;
}

export type ParamsObject = Record<
  string,
  string | number | boolean | ReadonlyArray<string | number | boolean>
>;

export type SortableColumn = keyof Omit<Document, 'creator'>;

export interface GetDocumentsParams extends ParamsObject {
  page: number;
  size: number;
  sortBy?: SortableColumn;
  sortDirection?: SortDirection;
  status?: DocumentStatus;
  creatorId?: string;
  creatorEmail?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface Document {
  creator?: User;
  fileUrl?: string;
  id: string;
  name: string;
  status: DocumentStatus;
  updatedAt: string;
  createdAt: string;
}

export type DocumentViewModel = Omit<Document, 'creator'> & {
  creatorId?: string;
  creatorEmail?: string;
  creatorName?: string;
  availableActions: DocumentAction[];
};

export interface GetDocumentsViewModel extends GetDocumentsResponse {
  results: DocumentViewModel[];
}

export interface JwtPayload {
  exp: number;
  sub: string;
  iat: number;
  email: string;
}
