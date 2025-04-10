import { computed, Directive, inject, Signal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ActionEvent,
  ListConfig,
} from '@components/document-list/document-list.component';
import { DocumentAction, DocumentCommand } from '@services/document-commands';
import { DocumentService } from '@services/document.service';
import { Observable } from 'rxjs';
import {
  Document,
  DocumentViewModel,
  GetDocumentsParams,
} from 'types/api-schema';

/**
 * This is an abstract class for (role-based) container-components.
 * It encapsulates common low-level logic and provides convenient tools for managing state,
 * specifically for displaying lists of documents and handling actions on them.
 */
@Directive({ host: { class: 'container' } })
export abstract class BaseDashboardComponent {
  protected documentService = inject(DocumentService);

  /**
   * An abstract protected property that subclasses must implement.
   * It represents the list of available commands (actions) that can be performed on documents.
   */
  protected abstract commands: DocumentCommand[];

  /**
   * An abstract public signal that subclasses must implement.
   * It provides configuration for the presentation-component.
   */
  public abstract listConfig: Signal<ListConfig>;

  /**
   * A public signal that holds the configuration for document pagination, sorting, and filtering.
   */
  public paginationConfig = signal<GetDocumentsParams>({
    page: 1,
    size: 10,
    sortBy: 'updatedAt',
    sortDirection: 'desc',
  });

  /**
   * Uses `rxResource` to manage the asynchronous loading of documents based on the pagination configuration. It calls the abstract `documentsLoader` method.
   */
  protected documentsRes = rxResource({
    request: () => ({ pagination: this.paginationConfig() }),
    loader: ({ request }) => this.documentsLoader(request),
  });
  protected documents = computed(() => {
    if (!this.documentsRes.hasValue()) {
      return { results: [], count: 0 };
    }

    return this.documentsRes.value();
  });

  /**
   * An abstract protected method that subclasses must implement to handle the actual fetching of documents.
   * It takes an object containing the pagination parameters and returns an Observable of the document data.
   */
  protected abstract documentsLoader(params: {
    pagination: GetDocumentsParams;
  }): Observable<{
    results: DocumentViewModel[];
    count: number;
  }>;

  /**
   * A protected method that calculates the available actions for a given document based on the defined `commands`.
   */
  protected calculateAvailableActions(doc: Document): DocumentAction[] {
    return this.commands
      .filter((command) => command.isAvailable(doc))
      .map((command) => command.relatedAction);
  }

  /**
   * A public method that handles an action performed on a document using the specific `command` that corresponds to the triggered action type..
   */
  public handleDocumentAction({ type, document }: ActionEvent): void {
    const command = this.commands.find(
      (command) => command.relatedAction.type === type
    );

    if (command) {
      // Execute the command on the given document. The command's execute method might return an Observable
      // that emits a boolean indicating whether the document list needs to be reloaded.
      command.execute(document).subscribe((shouldReload) => {
        if (shouldReload) {
          this.documentsRes.reload();
        }
      });
    }
  }
}
