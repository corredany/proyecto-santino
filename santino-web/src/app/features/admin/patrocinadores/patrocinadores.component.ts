import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatrocinadorService } from '../../../core/services/patrocinador.service';
import type { Patrocinador } from '../../../shared/models/patrocinador.model';

@Component({
  selector: 'app-patrocinadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patrocinadores.component.html',
  styleUrl: './patrocinadores.component.css',
})
export class PatrocinadoresComponent implements OnInit {
  private readonly service = inject(PatrocinadorService);

  patrocinadores: Patrocinador[] = [];
  cargando = true;
  archivo: File | null = null;
  nombre = '';
  url = '';
  subiendo = false;

  editandoId: number | null = null;
  editNombre = '';
  editUrl = '';
  editOrden: number | undefined;
  guardando = false;

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando = true;
    this.service.listar().subscribe({
      next: (data) => { this.patrocinadores = data; this.cargando = false; },
      error: () => { this.cargando = false; },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
  }

  crear() {
    if (!this.archivo || !this.nombre || !this.url) return;
    this.subiendo = true;
    this.service.crear(this.archivo, { nombre: this.nombre, url: this.url }).subscribe({
      next: () => { this.subiendo = false; this.archivo = null; this.nombre = ''; this.url = ''; this.cargar(); },
      error: () => { this.subiendo = false; },
    });
  }

  abrirEdicion(p: Patrocinador) {
    this.editandoId = p.id;
    this.editNombre = p.nombre;
    this.editUrl = p.url;
    this.editOrden = p.orden;
  }

  cancelarEdicion() {
    this.editandoId = null;
  }

  guardar(id: number) {
    this.guardando = true;
    this.service.actualizar(id, { nombre: this.editNombre, url: this.editUrl, orden: this.editOrden }).subscribe({
      next: () => { this.guardando = false; this.editandoId = null; this.cargar(); },
      error: () => { this.guardando = false; },
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este patrocinador?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }
}
