import { Component, computed, inject, Signal } from '@angular/core';
import { map } from 'rxjs';

import { DocumentListComponent, type ListConfig } from '@components';
import {
  ChangeStatusCommand,
  DocumentCommand,
  ViewDocumentCommand,
} from '@services/document-commands';
import { DOCUMENT_STATUSES } from 'app/constants';
import { DocumentViewModel, GetDocumentsParams } from 'types/api-schema';
import { BaseDashboardComponent } from '../base-dashboard';

@Component({
  selector: 'app-reviewer-dashboard',
  imports: [DocumentListComponent],
  templateUrl: './reviewer-dashboard.component.html',
  styleUrl: './reviewer-dashboard.component.scss',
})
export class ReviewerDashboardComponent extends BaseDashboardComponent {
  protected commands: DocumentCommand[] = [
    inject(ViewDocumentCommand),
    inject(ChangeStatusCommand),
  ];

  public listConfig: Signal<ListConfig> = computed(() => {
    // Role-specific configuration
    return {
      columns: [
        'creatorId',
        'creatorEmail',
        'name',
        'status',
        'createdAt',
        'updatedAt',
      ],
      allowedStatuses: DOCUMENT_STATUSES.filter((status) => status !== 'DRAFT'),
      extraColumnFilters: ['creatorId', 'creatorEmail'],
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
              creatorId: creator?.id,
              creatorEmail: creator?.email,
              creatorName: creator?.fullName,
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
