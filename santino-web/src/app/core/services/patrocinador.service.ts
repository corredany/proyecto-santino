import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { Patrocinador, CrearPatrocinadorDto } from '../../shared/models/patrocinador.model';

@Injectable({ providedIn: 'root' })
export class PatrocinadorService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.contenidoApi}/patrocinadores`;

  listar() {
    return this.http.get<Patrocinador[]>(this.url);
  }

  crear(archivo: File, dto: CrearPatrocinadorDto) {
    const form = new FormData();
    form.append('logo', archivo);
    form.append('nombre', dto.nombre);
    form.append('url', dto.url);
    if (dto.orden != null) form.append('orden', String(dto.orden));
    return this.http.post<Patrocinador>(this.url, form);
  }

  actualizar(id: number, dto: { nombre?: string; url?: string; orden?: number }) {
    return this.http.put<Patrocinador>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
