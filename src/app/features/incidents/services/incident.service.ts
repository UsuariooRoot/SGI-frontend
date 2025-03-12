import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ticket {
  id_ticket:      number;
  titulo:         string;
  descripcion:    string;
  fecha_creacion: string;
  estado:         string;
  reportado_por:  string;
  asignado_a:     null | string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private dataUrl = 'data/incidents.json';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de incidentes desde el archivo JSON simulado.
   * @returns Observable con un array de ITicket[]
   */
  getIncidents(): Observable<Ticket[]> {
    return this.http.get<{ data: Ticket[] }>(this.dataUrl).pipe(
      map(response => response.data)
    );
  }
}
