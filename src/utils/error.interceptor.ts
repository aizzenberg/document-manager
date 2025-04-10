import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '@services';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const errService = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // Client Error
        errService.handleError(error.error.message);
      } else {
        // Server Error
        errService.handleError(
          error.error?.message || error.message,
          `Code ${error.status}`
        );
      }
      return throwError(() => error);
    })
  );
}
