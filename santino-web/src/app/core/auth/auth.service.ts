import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string;
  rolId: number;
  rolNombre: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: UsuarioSesion;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly USER_KEY = 'usuario_sesion';

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.authApi}/auth/login`, { email, contrasena: password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.accessToken);
          localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
        }),
      );
  }

  refresh() {
    const token = localStorage.getItem(this.REFRESH_KEY);
    return this.http
      .post<{ accessToken: string }>(`${environment.authApi}/auth/refresh`, { token })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        }),
      );
  }

  /** Elimina los tokens sin redirigir. Úsalo desde guards/interceptors. */
  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/admin/login']);
  }

  getUsuario(): UsuarioSesion | null {
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) return null;
    const usuario: UsuarioSesion = JSON.parse(data);
    if (!usuario.rolNombre) {
      const payload = this.decodePayload(this.getToken() ?? '');
      if (payload && (payload as any).rolNombre) {
        usuario.rolNombre = (payload as any).rolNombre;
        localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
      }
    }
    return usuario;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  /** Decodifica el payload de un JWT sin librerías externas. */
  private decodePayload(token: string): { exp?: number } | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // JWT omite el padding '=' — atob lo necesita en algunos entornos
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  /** Devuelve true si el token ya expiró o no tiene claim `exp`. */
  isTokenExpired(token: string): boolean {
    const payload = this.decodePayload(token);
    if (!payload?.exp) return true;
    // exp está en segundos, Date.now() en milisegundos
    return Date.now() >= payload.exp * 1000;
  }

  /** True solo si el access token existe Y no ha expirado. */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
}
