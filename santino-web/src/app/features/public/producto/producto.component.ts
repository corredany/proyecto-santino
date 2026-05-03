import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { GalleriaMarcas } from '../../../components/marcas-gallery.component/marcas-gallery.component';
import { SeccionService } from '../../../core/services/seccion.service';
import { ImagenService } from '../../../core/services/imagen.service';
import { MaterialService } from '../../../core/services/material.service';
import type { Seccion } from '../../../shared/models/seccion.model';
import type { Imagen } from '../../../shared/models/imagen.model';
import type { Material } from '../../../shared/models/material.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, GalleriaModule, ButtonComponent, GalleriaMarcas],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
})
export class ProductoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seccionService = inject(SeccionService);
  private readonly imagenService = inject(ImagenService);
  private readonly materialService = inject(MaterialService);

  seccion: Seccion | null = null;
  imagenes: Imagen[] = [];
  materiales: Material[] = [];
  loading = true;
  error: string | null = null;

  responsiveOptions = [
    { breakpoint: '1300px', numVisible: 4 },
    { breakpoint: '575px', numVisible: 1 },
  ];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.cargar(params['id']);
    });
  }

  private cargar(slug: string) {
    this.loading = true;
    this.error = null;
    this.materiales = [];

    this.seccionService.listar().subscribe({
      next: (secciones) => {
        const toSlug = (n: string) =>
          n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
        const match = secciones.find((s) => toSlug(s.nombre) === slug);
        if (!match) {
          this.error = 'Sección no encontrada';
          this.loading = false;
          return;
        }
        this.seccion = match;

        let pendientes = 2;
        const fin = () => { if (--pendientes === 0) this.loading = false; };

        this.imagenService.listar(match.id).subscribe({
          next: (imgs) => { this.imagenes = imgs; fin(); },
          error: () => fin(),
        });

        // Carga materiales de la sección; si no hay, carga los globales (seccionId null)
        this.materialService.listar(match.id).subscribe({
          next: (mats) => {
            if (mats.length > 0) {
              this.materiales = mats;
              fin();
            } else {
              this.materialService.listar().subscribe({
                next: (all) => { this.materiales = all; fin(); },
                error: () => fin(),
              });
            }
          },
          error: () => fin(),
        });
      },
      error: () => {
        this.error = 'Error al cargar la sección';
        this.loading = false;
      },
    });
  }
}
