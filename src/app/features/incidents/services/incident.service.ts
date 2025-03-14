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

export interface Incident {
  id:   number;
  name: string;
}

export interface IncidentCategory {
  categoryId: number;
  category:   string;
  incidents:  Incident[];
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private ticketsUrl = 'data/incidents.json';
  private incidentsUrl = 'data/list-incidents.json';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de tickets desde el archivo JSON simulado.
   * @returns Observable con un array de ITicket[]
   */
  getTickets(): Observable<Ticket[]> {
    return this.http.get<{ data: Ticket[] }>(this.ticketsUrl).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene la lista categoría de incidentes desde el archivo JSON simulado.
   * @returns Observable con un array de IncidentCategory[]
   */
  getIncidents(): Observable<IncidentCategory[]> {
    return this.http.get<{ data: IncidentCategory[] }>(this.incidentsUrl).pipe(
      map(response => response.data)
    );
  }


}
