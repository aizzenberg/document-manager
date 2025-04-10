import { inject, Injectable } from '@angular/core';
import { DocumentService, ModalService } from '@services';
import { finalize, map, Observable, of, switchMap } from 'rxjs';
import { Document } from 'types/api-schema';
import { DocumentAction, DocumentCommand } from './base';

@Injectable({
  providedIn: 'root',
})
export class RevokeDocumentCommand implements DocumentCommand {
  relatedAction: DocumentAction = {
    type: 'REVOKE',
    label: 'Revoke',
    icon: 'undo',
    colorClass: 'warn',
  };

  private documentService = inject(DocumentService);
  private modalService = inject(ModalService);

  isAvailable(document: Document): boolean {
    return ['READY_FOR_REVIEW'].includes(document.status);
  }

  execute(document: Document): Observable<boolean> {
    return this.modalService
      .openConfirmationModal('Are you sure you want to revoke the document?')
      .pipe(
        switchMap((modalResult) => {
          if (modalResult.data) {
            modalResult.setLoading(true);
            return this.documentService.revokeReview(document.id).pipe(
              map(() => true),
              finalize(() => modalResult.closeDialog())
            );
          }
          return of(false);
        })
      );
  }
}
