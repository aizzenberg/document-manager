import { inject, Injectable } from '@angular/core';
import { DocumentService, ModalService } from '@services';
import { finalize, map, Observable, of, switchMap } from 'rxjs';
import { DocumentAction, DocumentCommand } from './base';

@Injectable({
  providedIn: 'root',
})
export class AddDocumentCommand implements DocumentCommand {
  relatedAction: DocumentAction = {
    type: 'ADD',
    label: 'Add Document',
  };

  private documentService = inject(DocumentService);
  private modalService = inject(ModalService);

  isAvailable(): boolean {
    return false; // False, because we don't want this command to be shown as the document action in the list
  }

  execute(): Observable<boolean> {
    return this.modalService.openAddDocumentModal().pipe(
      switchMap((modalResult) => {
        if (modalResult.data) {
          modalResult.setLoading(true);
          return this.documentService.addDocument(modalResult.data).pipe(
            map(() => true),
            finalize(() => modalResult.closeDialog())
          );
        }
        return of(false);
      })
    );
  }
}
