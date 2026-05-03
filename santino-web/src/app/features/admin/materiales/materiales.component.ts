import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../../core/services/material.service';
import { SeccionService } from '../../../core/services/seccion.service';
import type { Material } from '../../../shared/models/material.model';
import type { Seccion } from '../../../shared/models/seccion.model';

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materiales.component.html',
  styleUrl: './materiales.component.css',
})
export class MaterialesComponent implements OnInit {
  private readonly service = inject(MaterialService);
  private readonly seccionService = inject(SeccionService);

  materiales: Material[] = [];
  secciones: Seccion[] = [];
  cargando = true;
  archivo: File | null = null;
  nombre = '';
  descripcion = '';
  seccionId: number | undefined;
  orden: number | undefined;
  subiendo = false;

  editandoId: number | null = null;
  editNombre = '';
  editDescripcion = '';
  editSeccionId: number | null | undefined = undefined;
  editOrden: number | undefined;
  guardando = false;

  ngOnInit() {
    this.seccionService.listar().subscribe((s) => (this.secciones = s));
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.service.listar(this.seccionId).subscribe({
      next: (data) => { this.materiales = data; this.cargando = false; },
      error: () => { this.cargando = false; },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
  }

  subir() {
    if (!this.archivo || !this.nombre) return;
    this.subiendo = true;
    this.service.subir(this.archivo, this.nombre, this.descripcion, this.seccionId, this.orden).subscribe({
      next: () => { this.subiendo = false; this.archivo = null; this.nombre = ''; this.descripcion = ''; this.cargar(); },
      error: () => { this.subiendo = false; },
    });
  }

  abrirEdicion(m: Material) {
    this.editandoId = m.id;
    this.editNombre = m.nombre;
    this.editDescripcion = m.descripcion ?? '';
    this.editSeccionId = m.seccionId;
    this.editOrden = m.orden;
  }

  cancelarEdicion() {
    this.editandoId = null;
  }

  guardar(id: number) {
    this.guardando = true;
    this.service.actualizar(id, {
      nombre: this.editNombre,
      descripcion: this.editDescripcion || null,
      seccionId: this.editSeccionId ?? null,
      orden: this.editOrden,
    }).subscribe({
      next: () => { this.guardando = false; this.editandoId = null; this.cargar(); },
      error: () => { this.guardando = false; },
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este material?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }

  nombreSeccion(id: number | null): string {
    if (id == null) return '—';
    return this.secciones.find((s) => s.id === id)?.nombre ?? String(id);
  }
}
