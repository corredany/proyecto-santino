import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Rol {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly http = inject(HttpClient);

  listar() {
    return this.http.get<Rol[]>(`${environment.authApi}/roles`);
  }
}
