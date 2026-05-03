import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

interface Acceso {
  label: string;
  ruta: string;
  icono: string;
  roles: string[];
}

const ACCESOS: Acceso[] = [
  { label: 'Secciones',      ruta: '/admin/secciones',      icono: 'pi-th-large',    roles: ['admin', 'editor'] },
  { label: 'Imágenes',       ruta: '/admin/imagenes',       icono: 'pi-images',      roles: ['admin', 'editor'] },
  { label: 'Videos',         ruta: '/admin/videos',         icono: 'pi-video',       roles: ['admin', 'editor'] },
  { label: 'Materiales',     ruta: '/admin/materiales',     icono: 'pi-folder-open', roles: ['admin', 'editor'] },
  { label: 'Patrocinadores', ruta: '/admin/patrocinadores', icono: 'pi-star',        roles: ['admin', 'editor'] },
  { label: 'Usuarios',       ruta: '/admin/usuarios',       icono: 'pi-users',       roles: ['admin'] },
  { label: 'Citas',          ruta: '/admin/citas',          icono: 'pi-calendar',    roles: ['admin', 'recepcionista'] },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  readonly accesos: Acceso[] = (() => {
    const usuario = this.authService.getUsuario();
    if (!usuario?.rolNombre) return ACCESOS;
    return ACCESOS.filter((a) => a.roles.includes(usuario.rolNombre));
  })();
}
