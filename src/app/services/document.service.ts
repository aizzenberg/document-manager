import { inject, Injectable } from '@angular/core';
import { DocumentStatus } from 'app/constants';
import { Observable } from 'rxjs';
import {
  Document,
  GetDocumentsParams,
  GetDocumentsResponse,
} from 'types/api-schema';
import { transformSortParams } from 'utils/helpers';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiService = inject(ApiService);

  getDocuments(params: GetDocumentsParams): Observable<GetDocumentsResponse> {
    return this.apiService.get<GetDocumentsResponse>(
      '/document',
      transformSortParams(params)
    );
  }

  getDocumentById(documentId: string): Observable<Document> {
    return this.apiService.get<Document>(`/document/${documentId}`);
  }

  addDocument(documentData: {
    name: string;
    status: DocumentStatus;
    file: File;
  }): Observable<Document> {
    const formData = new FormData();
    formData.append('name', documentData.name);
    formData.append('status', documentData.status);
    formData.append('file', documentData.file);

    return this.apiService.post<Document>('/document', formData);
  }

  editDocumentName(documentId: string, name: string): Observable<void> {
    return this.apiService.patch<void>(`/document/${documentId}`, { name });
  }

  deleteDocument(documentId: string): Observable<void> {
    return this.apiService.delete<void>(`/document/${documentId}`);
  }

  sendToReview(documentId: string): Observable<void> {
    return this.apiService.post<void>(`/document/${documentId}/send-to-review`);
  }

  revokeReview(documentId: string): Observable<void> {
    return this.apiService.post<void>(`/document/${documentId}/revoke-review`);
  }

  changeDocumentStatus(
    documentId: string,
    status: DocumentStatus
  ): Observable<void> {
    return this.apiService.post<void>(`/document/${documentId}/change-status`, {
      status,
    });
  }
}
