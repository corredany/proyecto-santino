import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { Material } from '../../shared/models/material.model';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.contenidoApi}/materiales`;

  listar(seccionId?: number) {
    if (seccionId != null) {
      return this.http.get<Material[]>(`${this.url}/seccion/${seccionId}`);
    }
    return this.http.get<Material[]>(this.url);
  }

  subir(archivo: File, nombre: string, descripcion?: string, seccionId?: number, orden?: number) {
    const form = new FormData();
    form.append('archivo', archivo);
    form.append('nombre', nombre);
    if (descripcion) form.append('descripcion', descripcion);
    if (seccionId != null) form.append('seccionId', String(seccionId));
    if (orden != null) form.append('orden', String(orden));
    return this.http.post<Material>(this.url, form);
  }

  actualizar(id: number, dto: { nombre?: string; descripcion?: string | null; seccionId?: number | null; orden?: number }) {
    return this.http.put<Material>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
