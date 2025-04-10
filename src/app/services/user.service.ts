import { computed, effect, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { User } from 'types/api-schema';
import { AuthService } from '../auth/auth.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  private userInfo = rxResource({
    request: () => ({ isAuthenticated: this.authService.isAuthenticated() }),
    loader: ({ request }) => {
      if (!request.isAuthenticated) {
        return of(null);
      }
      return this.fetchUserInfo();
    },
  });

  userId = computed(() => this.userInfo.value()?.id);
  userRole = computed(() => this.userInfo.value()?.role);

  constructor() {
    effect(() => {
      const errorFetchingUserInfo = this.userInfo.error();

      if (errorFetchingUserInfo) {
        this.authService.logout(); //  If the core user information cannot be loaded, the user cannot proceed within the application
      }
    });
  }

  private fetchUserInfo() {
    return this.apiService.get<User>('/user');
  }
}
