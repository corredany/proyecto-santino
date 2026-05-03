import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { Cita, CrearCitaDto, ActualizarCitaDto } from '../../shared/models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.citasApi}/api/citas`;

  listar() {
    return this.http.get<Cita[]>(this.url);
  }

  obtener(id: number) {
    return this.http.get<Cita>(`${this.url}/${id}`);
  }

  crear(dto: CrearCitaDto) {
    return this.http.post<Cita>(this.url, dto);
  }

  actualizar(id: number, dto: ActualizarCitaDto) {
    return this.http.put<Cita>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
