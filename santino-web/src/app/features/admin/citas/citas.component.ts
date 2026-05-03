import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service';
import type { Cita, ActualizarCitaDto } from '../../../shared/models/cita.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css',
})
export class CitasComponent implements OnInit {
  private readonly service = inject(CitaService);

  citas: Cita[] = [];
  cargando = true;
  editandoId: number | null = null;
  form: ActualizarCitaDto = {};

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando = true;
    this.service.listar().subscribe({
      next: (data) => { this.citas = data; this.cargando = false; },
      error: () => { this.cargando = false; },
    });
  }

  abrirEditar(c: Cita) {
    this.editandoId = c.id;
    this.form = { estado: c.estado, notas: c.notas ?? '' };
  }

  guardar() {
    if (!this.editandoId) return;
    this.service.actualizar(this.editandoId, this.form).subscribe({
      next: () => { this.editandoId = null; this.cargar(); },
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar esta cita?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }
}
