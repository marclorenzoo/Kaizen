import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor() {
        // Inicializar cliente Supabase
        this.supabase = createClient(
            environment.supabase.url,
            environment.supabase.key
        );

        this.currentUserSubject = new BehaviorSubject<User | null>(null);
        this.currentUser$ = this.currentUserSubject.asObservable();

        // Cargar sesión actual al iniciar
        this.loadUser();

        // Escuchar cambios de autenticación en tiempo real
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.currentUserSubject.next(session?.user ?? null);
        });
    }

    private async loadUser(): Promise<void> {
        const { data: { session } } = await this.supabase.auth.getSession();
        this.currentUserSubject.next(session?.user ?? null);
    }

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }
}