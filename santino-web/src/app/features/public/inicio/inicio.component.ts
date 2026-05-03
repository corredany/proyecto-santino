import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderInicioComponent } from '../../../components/slider-inicio/slider-inicio.component';
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { ImageCompareModule } from 'primeng/imagecompare';
import { NosotrosButtonComponent } from '../../../components/nosotros-button/nosotros-button.component';
import { GalleriaMarcas } from '../../../components/marcas-gallery.component/marcas-gallery.component';
import { SeccionService } from '../../../core/services/seccion.service';
import { VideoService } from '../../../core/services/video.service';
import { ImagenService } from '../../../core/services/imagen.service';
import { forkJoin } from 'rxjs';
import type { Video } from '../../../shared/models/video.model';
import type { Imagen } from '../../../shared/models/imagen.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, SliderInicioComponent, ButtonComponent, ImageCompareModule, NosotrosButtonComponent, GalleriaMarcas],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent implements OnInit {
  private readonly seccionService = inject(SeccionService);
  private readonly videoService = inject(VideoService);
  private readonly imagenService = inject(ImagenService);
  private readonly cdr = inject(ChangeDetectorRef);

  videos: Video[] = [];
  imagenes: Imagen[] = [];

  ngOnInit() {
    this.seccionService.listar().subscribe({
      next: (secciones) => {
        const match = secciones.find((s) => s.nombre.toLowerCase().includes('inicio'));
        if (!match) return;
        forkJoin({
          videos: this.videoService.listar(match.id),
          imagenes: this.imagenService.listar(match.id),
        }).subscribe({
          next: ({ videos, imagenes }) => {
            this.videos = [...videos].sort((a, b) => a.orden - b.orden);
            this.imagenes = [...imagenes].sort((a, b) => a.orden - b.orden);
            this.cdr.markForCheck();
          },
        });
      },
    });
  }

  video(orden: number): string {
    return this.videos.find((v) => v.orden === orden)?.url ?? '';
  }

  imagenComparacion(indice: number): string {
    return this.imagenes[indice]?.url ?? '';
  }
}
