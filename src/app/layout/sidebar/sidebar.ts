import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  async handleLogout() {
    await this.authService.signOut();
  }

}
