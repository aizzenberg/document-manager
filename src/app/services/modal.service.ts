import { inject, Injectable, Type } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { Document } from 'types/api-schema';

import {
  AddDocumentDialogComponent,
  type AddDocumentOutput,
  ChangeStatusDialogComponent,
  ConfirmationDialogComponent,
  EditNameDialogComponent,
} from '@components/modals';

import {
  BaseDialogComponent,
  type DialogConfig,
  type DialogData,
} from '@components/modals/base-dialog.component';

import { DocumentStatus } from 'app/constants';

interface ModalResult<T> {
  data: T | undefined;
  /**
   * Function to update the loading state of the dialog.
   */
  setLoading(isLoading: boolean): void;
  /**
   * Function that closes the dialog. It could also contain clean up logic.
   */
  closeDialog(): void;
}

/**
 * This service provides the management of modal windows within the application.
 * It encapsulates the logic for opening different types of modal dialogs,
 * passing them metadata such as an `isLoading` observable, and provides modal openers
 * that allow managing the isLoading state of a modal and determining when it needs to be closed.
 */
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(MatDialog);

  openAddDocumentModal(): Observable<
    ModalResult<AddDocumentOutput | undefined>
  > {
    return this.openDialog(AddDocumentDialogComponent);
  }

  openEditNameModal(
    document: Document
  ): Observable<ModalResult<string | undefined>> {
    return this.openDialog(EditNameDialogComponent, { document });
  }

  openChangeStatusModal(
    document: Document
  ): Observable<ModalResult<DocumentStatus | undefined>> {
    return this.openDialog(ChangeStatusDialogComponent, { document });
  }

  openConfirmationModal(
    message: string
  ): Observable<ModalResult<boolean | undefined>> {
    return this.openDialog(ConfirmationDialogComponent, { message });
  }

  /**
   * A private generic method that handles the opening of a modal dialog.
   * It sets up the dialog configuration, including passing input data and an `isLoading` observable.
   *
   * @param component The Angular Component to be opened as a dialog. It must extend `BaseDialogComponent`.
   * @param inputData Optional data to be passed to the dialog component.
   * @returns An Observable that emits a `ModalResult`, providing access to the dialog's output and control functions.
   */
  private openDialog<
    T extends BaseDialogComponent<D, R>,
    D extends DialogData,
    R
  >(
    component: Type<T>,
    inputData = {} as D
  ): Observable<ModalResult<R | undefined>> {
    const isLoading$ = new BehaviorSubject(false);
    const dialogDataWithMetadata: DialogConfig<D> = {
      data: { ...inputData },
      isLoading$: isLoading$.asObservable(),
    };
    const config: MatDialogConfig<DialogConfig<D>> = {
      data: dialogDataWithMetadata,
      disableClose: true,
      panelClass: 'modal',
    };
    const dialogRef = this.dialog.open<T, DialogConfig<D>, R>(
      component,
      config
    );

    return this.createModalResultObservable(dialogRef, isLoading$);
  }

  /**
   * A private generic method that creates an Observable to handle the result of the modal dialog.
   * This Observable provides the dialog's output data, a function to close the dialog, and a function to set the loading state.
   *
   * @param dialogRef The `MatDialogRef` of the opened dialog.
   * @param isLoading$ The `BehaviorSubject` used to manage the loading state of the dialog.
   * @returns An Observable emitting a `ModalResult`.
   */
  private createModalResultObservable<
    T extends BaseDialogComponent<DialogData, R>,
    R
  >(
    dialogRef: MatDialogRef<T, R>,
    isLoading$: BehaviorSubject<boolean>
  ): Observable<ModalResult<R | undefined>> {
    return new Observable<ModalResult<R | undefined>>((subscriber) => {
      dialogRef.componentInstance.onDataEmit().subscribe((outputData) => {
        subscriber.next({
          data: outputData as R,
          closeDialog() {
            isLoading$.next(false);
            isLoading$.complete();
            dialogRef.close();
          },
          setLoading(isLoading) {
            isLoading$.next(isLoading);
          },
        });
        subscriber.complete();
      });
    });
  }
}
