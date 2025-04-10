import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * This is an HTTP interceptor function
 * that adds an authentication token to outgoing HTTP requests.
 */
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authToken = inject(AuthService).getAuthToken();

  // Pass the original request if it's an authentication request
  if (req.url.includes('auth/login')) {
    return next(req);
  }

  // If an authentication token exists, set it to the `Authorization` header.
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(authReq);
  }

  // Pass the original request
  return next(req);
}
