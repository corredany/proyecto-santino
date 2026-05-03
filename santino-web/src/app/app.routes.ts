import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { authGuard } from './core/auth/auth.guard';
import { rolGuard } from './core/auth/rol.guard';

export const routes: Routes = [
  // Sitio público — envuelto en PublicLayout (menu + footer)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/inicio/inicio.component').then((m) => m.InicioComponent),
      },
      {
        path: 'servicios/:id',
        loadComponent: () =>
          import('./features/public/producto/producto.component').then((m) => m.ProductoComponent),
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./features/public/nosotros/nosotros.component').then((m) => m.NosotrosComponent),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/public/contacto/contacto.component').then((m) => m.ContactoComponent),
      },
    ],
  },

  // Login admin — sin layout
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login.component').then((m) => m.LoginComponent),
  },

  // Panel admin — envuelto en AdminLayout, protegido por AuthGuard
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'secciones',
        loadComponent: () =>
          import('./features/admin/secciones/secciones.component').then((m) => m.SeccionesComponent),
      },
      {
        path: 'imagenes',
        loadComponent: () =>
          import('./features/admin/imagenes/imagenes.component').then((m) => m.ImagenesComponent),
      },
      {
        path: 'videos',
        loadComponent: () =>
          import('./features/admin/videos/videos.component').then((m) => m.VideosComponent),
      },
      {
        path: 'materiales',
        loadComponent: () =>
          import('./features/admin/materiales/materiales.component').then((m) => m.MaterialesComponent),
      },
      {
        path: 'patrocinadores',
        loadComponent: () =>
          import('./features/admin/patrocinadores/patrocinadores.component').then((m) => m.PatrocinadoresComponent),
      },
      {
        path: 'usuarios',
        canActivate: [rolGuard(['admin'])],
        loadComponent: () =>
          import('./features/admin/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'citas',
        canActivate: [rolGuard(['admin', 'recepcionista'])],
        loadComponent: () =>
          import('./features/admin/citas/citas.component').then((m) => m.CitasComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' },
];
