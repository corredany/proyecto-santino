import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeccionService } from '../../../core/services/seccion.service';

interface SeccionNav {
  nombre: string;
  slug: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  private readonly seccionService = inject(SeccionService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  secciones: SeccionNav[] = [];
  scrolled = false;
  menuAbierto = false;
  serviciosAbierto = false;
  enContacto = false;

  @HostListener('window:scroll')
  onScroll() {
    const nuevo = window.scrollY > 60;
    if (nuevo !== this.scrolled) {
      this.scrolled = nuevo;
      this.cdr.markForCheck();
    }
  }

  ngOnInit() {
    this.enContacto = this.router.url === '/contacto';

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.enContacto = (e as NavigationEnd).urlAfterRedirects === '/contacto';
      this.cdr.markForCheck();
    });

    this.seccionService.listarVisibles().subscribe({
      next: (secciones) => {
        this.secciones = secciones.map((s) => ({
          nombre: s.nombre,
          slug: this.toSlug(s.nombre),
        }));
        this.cdr.markForCheck();
      },
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    this.cdr.markForCheck();
  }

  cerrarMenu() {
    this.menuAbierto = false;
    this.serviciosAbierto = false;
    this.cdr.markForCheck();
  }

  private toSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-');
  }
}
