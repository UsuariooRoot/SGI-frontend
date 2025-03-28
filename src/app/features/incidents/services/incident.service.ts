import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, Incident, TicketStatus } from '../typings';
import { IncidentTicketFilter } from '../components/filters/filters.component';

export interface IncidentTicketResponse {
  id: number;
  description: string;
  status: TicketStatus;
  reported_by: Employee;
  assigned_to?: Employee;
  incident: Incident;
  id_it_team: number;
  created_at: Date;
}

export interface IncidentCategory {
  id: number;
  name: string;
  id_it_team: number;
  incidents: Incident[];
}

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly http = inject(HttpClient);

  /**
   * Obtiene la lista de tickets desde el archivo JSON simulado.
   * @returns Observable con un array de ITicket[]
   */
  getIncidentTickets({
    idItTeam,
    filter
  }: {
    idItTeam: number;
    filter?: IncidentTicketFilter;
  }): Observable<IncidentTicketResponse[]> {
    const params = new HttpParams().set('id_it_team', idItTeam);
    return this.http
      .get<{ data: IncidentTicketResponse[] }>('api/tickets/incidents', { params })
      .pipe(map(response => response.data));
  }

  /**
   * Obtiene la lista categoría de incidentes desde el archivo JSON simulado.
   * @returns Observable con un array de IncidentCategory[]
   */
  getIncidentCategory(): Observable<IncidentCategory[]> {
    return this.http
      .get<{ data: IncidentCategory[] }>('api/incidents')
      .pipe(map(response => response.data));
  }
}
