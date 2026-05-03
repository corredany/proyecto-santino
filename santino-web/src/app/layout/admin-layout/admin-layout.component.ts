import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../core/auth/auth.service';

interface NavItem {
  label: string;
  ruta: string;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',     ruta: '/admin/dashboard',     roles: ['admin', 'editor', 'recepcionista'] },
  { label: 'Secciones',     ruta: '/admin/secciones',     roles: ['admin', 'editor'] },
  { label: 'Imágenes',      ruta: '/admin/imagenes',      roles: ['admin', 'editor'] },
  { label: 'Videos',        ruta: '/admin/videos',        roles: ['admin', 'editor'] },
  { label: 'Materiales',    ruta: '/admin/materiales',    roles: ['admin', 'editor'] },
  { label: 'Patrocinadores',ruta: '/admin/patrocinadores',roles: ['admin', 'editor'] },
  { label: 'Usuarios',      ruta: '/admin/usuarios',      roles: ['admin'] },
  { label: 'Citas',         ruta: '/admin/citas',         roles: ['admin', 'recepcionista'] },
];

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario: UsuarioSesion | null = this.authService.getUsuario();

  readonly navItems: NavItem[] = NAV_ITEMS.filter(
    (item) => !this.usuario?.rolNombre || item.roles.includes(this.usuario.rolNombre),
  );

  logout(): void {
    this.authService.logout();
  }
}
