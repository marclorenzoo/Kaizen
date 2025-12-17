import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    const { error } = await this.authService.signIn(email, password);

    this.loading = false;

    if (error) {
      this.errorMessage = 'Credenciales incorrectas';
    } else {
      this.router.navigate(['/home/dashboard']);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    const { error } = await this.authService.signInWithGoogle();

    if (error) {
      this.loading = false;
      this.errorMessage = 'Error al iniciar sesión con Google';
    }
  }
}
