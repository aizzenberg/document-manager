import { Routes } from '@angular/router';
import { LoginComponent } from '@components';
import {
  authGuard,
  roleRedirectGuard,
  type ProtectedRoute,
} from './auth/guards';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    canActivateChild: [roleRedirectGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      {
        path: 'user',
        loadComponent: () =>
          import(
            './components/dashboard/user-dashboard/user-dashboard.component'
          ).then((m) => m.UserDashboardComponent),
        data: { role: 'USER' },
      },
      {
        path: 'reviewer',
        loadComponent: () =>
          import(
            './components/dashboard/reviewer-dashboard/reviewer-dashboard.component'
          ).then((m) => m.ReviewerDashboardComponent),
        data: { role: 'REVIEWER' },
      },
    ] as ProtectedRoute[],
  },
  {
    path: 'document/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/view-document/view-document.component').then(
        (m) => m.ViewDocumentComponent
      ),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
