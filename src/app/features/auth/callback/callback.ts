import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './callback.html'
})
export class Callback implements OnInit {

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      // Esperar a que Supabase procese el token OAuth de la URL
      const { data, error } = await this.supabaseService.getClient().auth.getSession();

      if (error) {
        console.error('Error procesando la sesión OAuth:', error);
        this.router.navigate(['/auth/login']);
        return;
      }

      if (data.session) {
        // Sesión establecida correctamente, navegar al dashboard
        this.router.navigate(['/home/dashboard']);
      } else {
        // No hay sesión, volver al login
        console.error('No se pudo establecer la sesión');
        this.router.navigate(['/auth/login']);
      }
    } catch (error) {
      console.error('Error en callback:', error);
      this.router.navigate(['/auth/login']);
    }
  }
}
