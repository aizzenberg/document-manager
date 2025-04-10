import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private snackBar = inject(MatSnackBar);

  handleError(message = 'Something went wrong.', title = 'Error'): void {
    const displayMessage = `[${title}] :: ${message}`;
    this.snackBar.open(displayMessage, 'Got it', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
