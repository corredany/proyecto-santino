import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  cargando = false;
  error: string | null = null;
  mostrarPassword = false;

  onSubmit() {
    this.cargando = true;
    this.error = null;

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.error = 'Credenciales incorrectas. Verifique su email y contraseña.';
        this.cargando = false;
      },
    });
  }
}
