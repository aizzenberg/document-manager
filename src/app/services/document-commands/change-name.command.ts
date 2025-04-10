import { inject, Injectable } from '@angular/core';
import { DocumentService, ModalService } from '@services';
import { finalize, map, Observable, of, switchMap } from 'rxjs';
import { Document } from 'types/api-schema';
import { DocumentAction, DocumentCommand } from './base';

@Injectable({
  providedIn: 'root',
})
export class ChangeNameCommand implements DocumentCommand {
  relatedAction: DocumentAction = {
    type: 'CHANGE_NAME',
    label: 'Edit Name',
    icon: 'edit',
  };

  private documentService = inject(DocumentService);
  private modalService = inject(ModalService);

  isAvailable(): boolean {
    return true; // True, because it's a default action which is available for each document
  }

  execute(document: Document): Observable<boolean> {
    return this.modalService.openEditNameModal(document).pipe(
      switchMap((modalResult) => {
        if (modalResult.data) {
          modalResult.setLoading(true);
          return this.documentService
            .editDocumentName(document.id, modalResult.data)
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
