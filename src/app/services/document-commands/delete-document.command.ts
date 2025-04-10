import { inject, Injectable } from '@angular/core';
import { DocumentService, ModalService } from '@services';
import { finalize, map, Observable, of, switchMap } from 'rxjs';
import { Document } from 'types/api-schema';
import { DocumentAction, DocumentCommand } from './base';

@Injectable({
  providedIn: 'root',
})
export class DeleteDocumentCommand implements DocumentCommand {
  relatedAction: DocumentAction = {
    type: 'DELETE',
    label: 'Delete Document',
    icon: 'delete',
    colorClass: 'error',
  };

  private documentService = inject(DocumentService);
  private modalService = inject(ModalService);

  isAvailable(document: Document): boolean {
    return ['REVOKE', 'DRAFT'].includes(document.status);
  }

  execute(document: Document): Observable<boolean> {
    return this.modalService
      .openConfirmationModal('Are you sure you want to delete the document?')
      .pipe(
        switchMap((modalResult) => {
          if (modalResult.data) {
            modalResult.setLoading(true);
            return this.documentService.deleteDocument(document.id).pipe(
              map(() => true),
              finalize(() => modalResult.closeDialog())
            );
          }
          return of(false);
        })
      );
  }
}
