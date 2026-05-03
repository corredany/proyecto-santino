import { Component, OnInit, inject } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { PatrocinadorService } from '../../core/services/patrocinador.service';

@Component({
  selector: 'app-galleria-marcas',
  templateUrl: './marcas-gallery.component.html',
  styleUrl: './marcas-gallery.component.css',
  standalone: true,
  imports: [GalleriaModule],
})
export class GalleriaMarcas implements OnInit {
  private readonly service = inject(PatrocinadorService);

  images: { thumbnailImageSrc: string; alt: string }[] = [];

  responsiveOptions = [
    { breakpoint: '1300px', numVisible: 4 },
    { breakpoint: '575px', numVisible: 1 },
  ];

  ngOnInit() {
    this.service.listar().subscribe({
      next: (data) => {
        this.images = data.map((p) => ({
          thumbnailImageSrc: p.url,
          alt: p.nombre,
        }));
      },
    });
  }
}
