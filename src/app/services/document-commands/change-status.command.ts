import { inject, Injectable } from '@angular/core';
import { DocumentService, ModalService } from '@services';
import { finalize, map, Observable, of, switchMap } from 'rxjs';
import { Document } from 'types/api-schema';
import { DocumentAction, DocumentCommand } from './base';

@Injectable({
  providedIn: 'root',
})
export class ChangeStatusCommand implements DocumentCommand {
  public relatedAction: DocumentAction = {
    type: 'CHANGE_STATUS',
    label: 'Change Status',
    icon: 'change_circle',
    colorClass: 'primary',
  };

  private documentService = inject(DocumentService);
  private modalService = inject(ModalService);

  isAvailable(document: Document): boolean {
    return ['UNDER_REVIEW', 'READY_FOR_REVIEW'].includes(document.status);
  }

  execute(document: Document): Observable<boolean> {
    return this.modalService.openChangeStatusModal(document).pipe(
      switchMap((modalResult) => {
        if (modalResult.data) {
          modalResult.setLoading(true);
          return this.documentService
            .changeDocumentStatus(document.id, modalResult.data)
            .pipe(
              map(() => true),
              finalize(() => modalResult.closeDialog())
            );
        }
        return of(false);
      })
    );
  }
}
