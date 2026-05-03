import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { Video } from '../../shared/models/video.model';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.contenidoApi}/videos`;

  listar(seccionId?: number) {
    if (seccionId != null) {
      return this.http.get<Video[]>(`${this.url}/seccion/${seccionId}`);
    }
    return this.http.get<Video[]>(this.url);
  }

  subir(archivo: File, seccionId?: number, orden?: number) {
    const form = new FormData();
    form.append('archivo', archivo);
    if (seccionId != null) form.append('seccionId', String(seccionId));
    if (orden != null) form.append('orden', String(orden));
    return this.http.post<Video>(this.url, form);
  }

  actualizar(id: number, dto: { seccionId?: number | null; orden?: number }) {
    return this.http.put<Video>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
