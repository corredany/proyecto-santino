import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { Seccion, CrearSeccionDto, ActualizarSeccionDto } from '../../shared/models/seccion.model';

@Injectable({ providedIn: 'root' })
export class SeccionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.contenidoApi}/secciones`;

  listar() {
    return this.http.get<Seccion[]>(this.url);
  }

  listarVisibles() {
    return this.http.get<Seccion[]>(`${this.url}/visibles`);
  }

  obtener(id: number) {
    return this.http.get<Seccion>(`${this.url}/${id}`);
  }

  crear(dto: CrearSeccionDto) {
    return this.http.post<Seccion>(this.url, dto);
  }

  actualizar(id: number, dto: ActualizarSeccionDto) {
    return this.http.put<Seccion>(`${this.url}/${id}`, dto);
  }

  toggleVisible(id: number) {
    return this.http.put<Seccion>(`${this.url}/${id}/toggle-visible`, {});
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
