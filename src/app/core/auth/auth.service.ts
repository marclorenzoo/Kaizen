import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private supabaseService: SupabaseService,
        private router: Router
    ) { }

    // REGISTRO con email/password
    async signUp(email: string, password: string, username?: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.supabaseService.getClient().auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    }

    // LOGIN con email/password
    async signIn(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    }

    // LOGIN con Google
    async signInWithGoogle(): Promise<AuthResponse> {
        try {
            const { data, error } = await this.supabaseService.getClient().auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    }

    // LOGOUT
    async signOut(): Promise<void> {
        await this.supabaseService.getClient().auth.signOut();
        this.router.navigate(['/auth/login']);
    }

    // Recuperar contraseña
    async resetPassword(email: string): Promise<AuthResponse> {
        try {
            const { error } = await this.supabaseService.getClient().auth.resetPasswordForEmail(
                email,
                { redirectTo: `${window.location.origin}/auth/reset-password` }
            );

            if (error) throw error;
            return { data: null, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    }

    // Obtener usuario actual (Observable)
    get currentUser$() {
        return this.supabaseService.currentUser$;
    }

    // Obtener usuario actual (valor directo)
    get currentUserValue() {
        return this.supabaseService.currentUserValue;
    }

    // Verificar si está autenticado
    isAuthenticated(): boolean {
        return this.currentUserValue !== null;
    }
}