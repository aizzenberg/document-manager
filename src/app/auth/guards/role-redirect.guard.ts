import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ErrorHandlerService, UserService } from '@services';
import { Role } from 'app/constants';
import { catchError, filter, map, of, take } from 'rxjs';

export interface ProtectedRoute extends Route {
  data: {
    role: Role;
  };
}

/**
 * This is a route guard function that controls whether a user can navigate to a child route based on their role.
 * It is intended to be used with the `canActivateChild` route configuration property of the route you want to divide by roles.
 *
 * Example usage in route configuration:
 * ```typescript
 * {
 *   path: 'container-path',
 *   canActivateChild: [roleRedirectGuard],
 *   children: [
 *      { path: '', redirectTo: 'role-one', pathMatch: 'full' },
 *      {
 *        path: 'role-one',
 *        component: RoleOneComponent,
 *        data: { role: 'ROLE_ONE' },
 *      },
 *      {
 *        path: 'role-two',
 *        component: RoleTwoComponent,
 *        data: { role: 'ROLE_TWO' },
 *      },
 *   ] as ProtectedRoute[],
 * },
 * ```
 * In this example, the `roleRedirectGuard` ensures that the user is redirected to the first child route
 * whose `data.role` matches their current user role obtained from the `UserService`.
 * The `children` array of the route where this guard is applied should be typed as `ProtectedRoute[]`
 * to ensure that each child route can have a `data` property with a `role`.
 */
export const roleRedirectGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const errService = inject(ErrorHandlerService);
  const router = inject(Router);

  return toObservable(userService.userRole).pipe(
    // filter undefined values
    filter((role) => !!role),
    take(1),
    map((role) => {
      // Find the first child route whose `data.role` matches their current user role
      const availableRoute = route.parent?.routeConfig?.children?.find(
        (route) => (route as ProtectedRoute).data?.role === role
      );
      const currentRoute = route.routeConfig as Route;

      if (!availableRoute) {
        errService.handleError(
          `No available routes for current role: "${role}"`,
          'RoleRedirectGuard'
        );

        // Redirect to login page if no route available
        return router.createUrlTree(['/login']);
      }

      if (availableRoute.path === currentRoute.path) {
        // Allow navigation to the current route if it's available
        return true;
      }

      // Redirect the user to the first available route that matches their role.
      return router.createUrlTree([
        `${route.parent?.routeConfig?.path}/${availableRoute.path}`,
      ]);
    }),
    catchError((error) => {
      console.error(
        'RoleRedirectGuard: Error while obtaining user role.',
        error
      );
      return of(router.createUrlTree(['/login'])); // Redirect to login page in case of error
    })
  );
};
