import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { GalleriaMarcas } from '../../../components/marcas-gallery.component/marcas-gallery.component';
import { SeccionService } from '../../../core/services/seccion.service';
import { ImagenService } from '../../../core/services/imagen.service';
import { VideoService } from '../../../core/services/video.service';
import type { Seccion } from '../../../shared/models/seccion.model';
import type { Imagen } from '../../../shared/models/imagen.model';
import type { Video } from '../../../shared/models/video.model';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, GalleriaModule, ButtonComponent, GalleriaMarcas],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css',
})
export class NosotrosComponent implements OnInit {
  private readonly seccionService = inject(SeccionService);
  private readonly imagenService = inject(ImagenService);
  private readonly videoService = inject(VideoService);

  seccion: Seccion | null = null;
  imagenes: Imagen[] = [];
  videos: Video[] = [];
  loading = true;
  error: string | null = null;

  responsiveOptions = [
    { breakpoint: '1300px', numVisible: 4 },
    { breakpoint: '575px', numVisible: 1 },
  ];

  ngOnInit() {
    this.seccionService.listar().subscribe({
      next: (secciones) => {
        const match = secciones.find((s) =>
          s.nombre.toLowerCase().includes('nosotros'),
        );
        if (!match) {
          this.loading = false;
          return;
        }
        this.seccion = match;

        const id = match.id;
        let pendientes = 2;
        const fin = () => { if (--pendientes === 0) this.loading = false; };

        this.imagenService.listar(id).subscribe({
          next: (imgs) => { this.imagenes = imgs; fin(); },
          error: () => fin(),
        });

        this.videoService.listar(id).subscribe({
          next: (vids) => { this.videos = [...vids].sort((a, b) => a.orden - b.orden); fin(); },
          error: () => fin(),
        });
      },
      error: () => {
        this.error = 'Error al cargar la información';
        this.loading = false;
      },
    });
  }
}
