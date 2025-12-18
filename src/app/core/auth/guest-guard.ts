import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), // Solo tomar el primer valor
    map(user => {
      if (user === null) {
        return true; // No autenticado, permitir acceso a auth routes
      }
      // Ya autenticado, redirigir al dashboard
      return router.createUrlTree(['/home/dashboard']);
    })
  );
};
