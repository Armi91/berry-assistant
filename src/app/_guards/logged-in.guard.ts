import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { map } from 'rxjs';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        return router.parseUrl('/auth/login');
      }
    })
  )
};
