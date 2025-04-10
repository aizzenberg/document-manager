import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@services';
import { environment } from 'environments/environment';
import { tap } from 'rxjs';
import { decodeJwtPayload } from 'utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private apiService = inject(ApiService);

  // A private signal to store the access token. It's initialized with the token from local storage if it exists.
  private accessToken = signal<string | null>(
    localStorage.getItem(environment.accessTokenKey)
  );

  isAuthenticated = computed(() => {
    const token = this.accessToken();
    if (!token) {
      return false;
    }

    // Decode the payload of the JWT token to access its claims.
    const payload = decodeJwtPayload(token);

    // Check if the token has an expiration time and determine if it's still valid
    if (payload?.exp) {
      return payload.exp > Date.now() / 1000;
    }
    return true; // If the token doesn't have an 'exp' field, consider it valid (depends on your security requirements)
  });

  constructor() {}

  login(credentials: { email: string; password: string }) {
    return this.apiService
      .post<{ access_token: string }>('/auth/login', credentials)
      .pipe(
        tap((response) => {
          // Set the 'accessToken' signal with the received access token and store it in local storage.
          this.accessToken.set(response.access_token);
          localStorage.setItem(
            environment.accessTokenKey,
            response.access_token
          );
        })
      );
  }

  logout(): void {
    // Clean up auth data and redirect to the login page
    this.accessToken.set(null);
    localStorage.removeItem(environment.accessTokenKey);
    this.router.navigate(['/login']);
  }

  /**
   * Return the current value of the 'accessToken' signal.
   */
  getAuthToken(): string | null {
    return this.accessToken();
  }
}
