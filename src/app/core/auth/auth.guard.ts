import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        take(1), // Solo tomar el primer valor
        map(user => {
            if (user !== null) {
                return true; // Usuario autenticado, permitir acceso
            }
            // No autenticado, redirigir a login
            return router.createUrlTree(['/auth/login']);
        })
    );
};