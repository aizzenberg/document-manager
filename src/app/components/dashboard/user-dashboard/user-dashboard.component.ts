import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { DocumentListComponent, type ListConfig } from '@components';
import {
  AddDocumentCommand,
  ChangeNameCommand,
  DeleteDocumentCommand,
  type DocumentCommand,
  RevokeDocumentCommand,
  ViewDocumentCommand,
} from '@services/document-commands';
import { DOCUMENT_STATUSES } from 'app/constants';
import { DocumentViewModel, GetDocumentsParams } from 'types/api-schema';
import { BaseDashboardComponent } from '../base-dashboard';

@Component({
  selector: 'app-user-dashboard',
  imports: [DocumentListComponent, MatButtonModule, MatIconModule],

  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent extends BaseDashboardComponent {
  protected commands: DocumentCommand[] = [
    inject(AddDocumentCommand),
    inject(ViewDocumentCommand),
    inject(ChangeNameCommand),
    inject(RevokeDocumentCommand),
    inject(DeleteDocumentCommand),
  ];

  public listConfig: Signal<ListConfig> = computed(() => {
    // Role-specific configuration
    return {
      columns: ['name', 'status', 'createdAt', 'updatedAt'],
      allowedStatuses: DOCUMENT_STATUSES,
      extraColumnFilters: [],
      data: this.documents(),
      isLoading: this.documentsRes.isLoading(),
    };
  });

  protected documentsLoader(params: { pagination: GetDocumentsParams }) {
    return this.documentService.getDocuments(params.pagination).pipe(
      map((resp) => {
        // Transforms the API result to suit the needs of a specific role
        // as well as
        // Provides availableActions for each document
        const convertedResults: DocumentViewModel[] = resp.results.map(
          (doc) => {
            const { creator, ...rest } = doc;

            return {
              ...rest,
              availableActions: this.calculateAvailableActions(doc),
            };
          }
        );

        return {
          ...resp,
          results: convertedResults,
        };
      })
    );
  }
}
