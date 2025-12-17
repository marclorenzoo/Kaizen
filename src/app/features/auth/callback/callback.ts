import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './callback.html'
})
export class Callback implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Supabase procesa la sesión automáticamente
    // Mostramos un loader y redirigimos
    setTimeout(() => {
      this.router.navigate(['/home/dashboard']);
    }, 2000);
  }
}
