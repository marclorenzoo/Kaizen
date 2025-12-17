import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const supabaseService = inject(SupabaseService);

    // Obtener token actual
    const user = supabaseService.currentUserValue;

    if (user) {
        // Clonar request y añadir header de autorización
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${user.id}` // Ajustar según necesites
            }
        });

        return next(clonedRequest);
    }

    return next(req);
};