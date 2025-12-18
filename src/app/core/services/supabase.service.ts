import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private currentUserSubject: ReplaySubject<User | null>;
    public currentUser$: Observable<User | null>;
    private _currentUserValue: User | null = null;
    private sessionLoaded = false;

    constructor() {
        // Inicializar cliente Supabase
        this.supabase = createClient(
            environment.supabase.url,
            environment.supabase.key
        );

        // ReplaySubject(1) guarda el último valor y lo emite a nuevos suscriptores
        // Pero NO emite nada hasta que llamemos a .next() por primera vez
        this.currentUserSubject = new ReplaySubject<User | null>(1);
        this.currentUser$ = this.currentUserSubject.asObservable();

        // Cargar sesión actual al iniciar
        this.loadUser();

        // Escuchar cambios de autenticación en tiempo real
        this.supabase.auth.onAuthStateChange((event, session) => {
            this._currentUserValue = session?.user ?? null;
            this.currentUserSubject.next(this._currentUserValue);
        });
    }

    private async loadUser(): Promise<void> {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            this._currentUserValue = session?.user ?? null;
            this.sessionLoaded = true;
            // Solo ahora emitimos el primer valor
            this.currentUserSubject.next(this._currentUserValue);
        } catch (error) {
            console.error('Error loading user session:', error);
            this._currentUserValue = null;
            this.sessionLoaded = true;
            this.currentUserSubject.next(null);
        }
    }

    get currentUserValue(): User | null {
        return this._currentUserValue;
    }

    get isSessionLoaded(): boolean {
        return this.sessionLoaded;
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }
}