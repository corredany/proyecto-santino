import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SeccionService } from '../../core/services/seccion.service';
import { ImagenService } from '../../core/services/imagen.service';

interface SlideItem {
  nombre: string;
  slug: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-slider-inicio',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, RouterLink],
  templateUrl: './slider-inicio.component.html',
  styleUrls: ['./slider-inicio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderInicioComponent implements OnInit {
  private readonly seccionService = inject(SeccionService);
  private readonly imagenService = inject(ImagenService);
  private readonly cdr = inject(ChangeDetectorRef);

  slides: SlideItem[] = [];

  responsiveOptions = [
    { breakpoint: '1920px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1400px', numVisible: 2, numScroll: 1 },
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px',  numVisible: 1, numScroll: 1 },
    { breakpoint: '560px',  numVisible: 1, numScroll: 1 },
  ];

  ngOnInit() {
    this.seccionService.listarVisibles().pipe(
      switchMap(secciones => {
        if (secciones.length === 0) return of([]);
        return forkJoin(
          secciones.map(s =>
            this.imagenService.listar(s.id).pipe(
              map(imgs => ({
                nombre: s.nombre,
                slug: this.toSlug(s.nombre),
                imagenUrl: imgs[0]?.url ?? 'img/fondo.jpg',
              })),
              catchError(() => of({
                nombre: s.nombre,
                slug: this.toSlug(s.nombre),
                imagenUrl: 'img/fondo.jpg',
              }))
            )
          )
        );
      })
    ).subscribe(slides => {
      this.slides = slides;
      this.cdr.markForCheck();
    });
  }

  private toSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-');
  }
}
