import { DestroyRef, Directive, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

export interface DialogMetadata<T extends DialogData> {
  data: T;
  isLoading$: Observable<boolean>;
}
export type DialogData = Record<string, unknown>;
export type DialogConfig<T extends DialogData = {}> = DialogMetadata<T>;

/**
 * This is the base abstract class for dialog components.
 * It encapsulates low-level logic and provides a convenient interface for specific dialog components.
 * It handles the injection of necessary services like MatDialogRef and MAT_DIALOG_DATA,
 * manages the dialog's output data, and provides a mechanism to track loading state.
 *
 * Subclasses extending this class will automatically have access to the dialog reference,
 * the data passed into the dialog, and methods for emitting data back to the component that opened the dialog.
 */
@Directive()
export abstract class BaseDialogComponent<T extends DialogData, O> {
  // 'this' refers to the specific component extending this base class, and 'O' is the type of data emitted when the dialog is closed.
  public dialogRef: MatDialogRef<this, O> = inject(MatDialogRef<this, O>);
  private config: DialogConfig<T> = inject(MAT_DIALOG_DATA);

  private destroyRef$ = inject(DestroyRef);
  private dataOutput = new Subject<O | undefined>();
  private isDataPassed = false;

  protected isLoading = toSignal(this.config.isLoading$, {
    initialValue: false,
  });

  constructor() {
    this.dialogRef.beforeClosed().subscribe((resp) => {
      // If data has not been explicitly emitted using 'emitData' before the dialog is closed,
      // emit the 'resp' value (which is the data passed to the dialogRef.close() method).
      // This handles cases where the dialog might be closed without a specific action emitting data.
      if (!this.isDataPassed) {
        this.emitData(resp);
      }
    });
  }

  protected get data() {
    return this.config.data;
  }

  /**
   * Public method that returns an Observable which the component that opened the dialog can subscribe to
   * to receive the data emitted when the dialog is closed.
   */
  public onDataEmit(): Observable<O | undefined> {
    return this.dataOutput.pipe(takeUntilDestroyed(this.destroyRef$));
  }

  // Protected method to explicitly emit data from the dialog and complete the output stream.
  protected emitData(output: O | undefined) {
    this.dataOutput.next(output);
    this.dataOutput.complete();
    this.isDataPassed = true;
  }
}
