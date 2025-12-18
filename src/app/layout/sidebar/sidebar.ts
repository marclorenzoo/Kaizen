// sidebar.ts
import { Component, inject, HostListener } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;
  isUserMenuOpen = false;

  toggleUserMenu(event: MouseEvent) {
    event.stopPropagation(); // Prevenir que el clic se propague al documento
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  async handleLogout() {
    this.closeUserMenu();
    await this.authService.signOut();
  }

  // Detectar clics fuera del menú
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isUserMenuOpen) {
      this.closeUserMenu();
    }
  }
}