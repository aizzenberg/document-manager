import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentActionType, DocumentStatus } from 'app/constants';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  DocumentViewModel,
  GetDocumentsParams,
  GetDocumentsViewModel,
  SortableColumn,
} from 'types/api-schema';
import { MyTitleCasePipe } from 'utils/title-case.pipe';

export interface ListConfig {
  columns: readonly string[];
  data: GetDocumentsViewModel;
  isLoading: boolean;
  extraColumnFilters: readonly string[];
  allowedStatuses: readonly DocumentStatus[];
}

export interface ActionEvent {
  type: DocumentActionType;
  document?: DocumentViewModel;
}

/**
 * This is a presentation component responsible for displaying a list of documents.
 * It receives configuration and data as inputs and emits events when actions are triggered.
 * It utilizes Angular Material for its UI elements and signals for managing state.
 */
@Component({
  selector: 'app-document-list',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MyTitleCasePipe,
    CommonModule,
    DatePipe,
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent implements OnInit {
  // Model signal that holds the pagination configuration using two-way data flow.
  readonly pagination = model.required<GetDocumentsParams>();

  // Input signal that holds the list configuration, defining how the list should be displayed.
  readonly listConfig = input.required<ListConfig>();
  readonly actionTriggered = output<ActionEvent>();

  // An array defining the columns that can be sorted in the table.
  readonly sortableColumns: string[] = [
    'id',
    'createdAt',
    'name',
    'status',
    'updatedAt',
  ];

  // A computed signal that determines the columns to be displayed in the table.
  // It combines the data columns from the list configuration with an 'actions' column for performing actions on rows.
  readonly displayedColumns = computed(() => {
    const dataColumns = this.listConfig().columns;
    const actionColumn = 'actions';
    return [...dataColumns, actionColumn];
  });

  private readonly destroyRef$ = inject(DestroyRef);

  // A private Subject used to emit filter values for specific columns.
  private readonly filterSubject = new Subject<{
    column: string;
    value: string;
  }>();

  ngOnInit(): void {
    if (this.listConfig()?.extraColumnFilters.length) {
      // If there are extra filters, connect to the filter input stream and subscribe to apply filtering.
      this.connectToFilterInputStream().subscribe(({ column, value }) => {
        this.filterByColumn(column, value);
      });
    }
  }

  sortData(sortState: Sort): void {
    this.pagination.update((state) => ({
      ...state,
      page: 1, // Reset to first page after sorting
      sortBy: sortState.active as SortableColumn,
      sortDirection: sortState.direction,
    }));
  }

  // Method called to filter the table data by a specific column.
  filterByColumn(column: string, value: string): void {
    this.pagination.update((state) => {
      if (!value) {
        let newState = { ...state };
        delete newState[column];
        return newState; // If value is undefined, remove this property from pagination params
      }

      return {
        ...state,
        page: 1, // Reset to first page after filtering
        [column]: value,
      };
    });
  }

  /**
   * Method that connects to the filter input stream, applying "stop-typing" search behavior.
   */
  connectToFilterInputStream() {
    return this.filterSubject.pipe(
      takeUntilDestroyed(this.destroyRef$),
      debounceTime(400),
      distinctUntilChanged()
    );
  }

  // Method called when the user types in a filter input field.
  setFilter(columnName: string, searchTerm: string): void {
    this.filterSubject.next({ column: columnName, value: searchTerm });
  }

  // Method called to clear the filter input for a specific column.
  clearInput(element: HTMLInputElement, columnName: string): void {
    element.value = '';
    this.setFilter(columnName, '');
  }

  // Method called when the user navigates to a different page in the paginator.
  handlePageEvent(event: PageEvent): void {
    this.pagination.update((state) => ({
      ...state,
      page: event.pageIndex + 1,
      size: event.pageSize,
    }));
  }
}
