import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return authState(auth).pipe(
    take(1),
    map(user => {
      if (user && user.uid === environment.adminUid) return true;
      return router.createUrlTree(['/admin/login']);
    })
  );
};
