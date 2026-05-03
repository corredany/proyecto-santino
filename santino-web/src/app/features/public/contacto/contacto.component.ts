import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ContactoForm {
  nombre: string;
  telefono: string;
  email: string;
  tipoProyecto: string;
  otroProyecto: string;
  calle: string;
  numero: string;
  codigoPostal: string;
  colonia: string;
  fecha: Date | null;
  comentarios: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  private readonly http = inject(HttpClient);

  showOtroInput = false;
  enviando = false;
  exito = false;
  errorEnvio: string | null = null;

  form: ContactoForm = {
    nombre: '',
    telefono: '',
    email: '',
    tipoProyecto: '',
    otroProyecto: '',
    calle: '',
    numero: '',
    codigoPostal: '',
    colonia: '',
    fecha: null,
    comentarios: '',
  };

  onTipoProyectoChange(value: string) {
    this.showOtroInput = value === 'otro';
    this.form.tipoProyecto = value;
  }

  onSubmit() {
    this.enviando = true;
    this.errorEnvio = null;

    const descripcion = [
      `Tipo de proyecto: ${this.form.tipoProyecto === 'otro' ? this.form.otroProyecto : this.form.tipoProyecto}`,
      `Domicilio: ${this.form.calle} ${this.form.numero}, ${this.form.colonia}, CP ${this.form.codigoPostal}`,
      `Teléfono: ${this.form.telefono}`,
      `Email: ${this.form.email}`,
      this.form.comentarios ? `Comentarios: ${this.form.comentarios}` : '',
    ].filter(Boolean).join(' | ');

    // Paso 1: crear el cliente en api-net
    this.http.post<{ id: number }>(`${environment.citasApi}/api/clientes`, {
      nombre: this.form.nombre,
      email: this.form.email,
      telefono: this.form.telefono,
    }).subscribe({
      next: (cliente) => {
        // Paso 2: crear la cita con el clienteId obtenido
        this.http.post(`${environment.citasApi}/api/citas`, {
          clienteId: cliente.id,
          fecha: this.form.fecha?.toISOString() ?? new Date().toISOString(),
          descripcion,
        }).subscribe({
          next: () => {
            this.exito = true;
            this.enviando = false;
          },
          error: (err: HttpErrorResponse) => {
            this.errorEnvio = err.error?.error ?? 'Error al agendar la cita. Por favor intente más tarde.';
            this.enviando = false;
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.errorEnvio = err.error?.error ?? 'Error al registrar sus datos. Por favor intente más tarde.';
        this.enviando = false;
      },
    });
  }
}
