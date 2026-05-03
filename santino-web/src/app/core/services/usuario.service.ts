import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { Usuario, CrearUsuarioDto, ActualizarUsuarioDto } from '../../shared/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.authApi}/usuarios`;

  listar() {
    return this.http.get<Usuario[]>(this.url);
  }

  obtener(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  crear(dto: CrearUsuarioDto) {
    return this.http.post<Usuario>(this.url, dto);
  }

  actualizar(id: number, dto: ActualizarUsuarioDto) {
    return this.http.put<Usuario>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
