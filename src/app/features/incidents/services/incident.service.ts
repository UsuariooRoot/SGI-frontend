import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Employee, Incident, Status } from '../typings';

export interface IncidentTicket {
  id: number;
  description: string;
  created_at: string;
  status: Status;
  reported_by: Employee;
  assigned_to: Employee;
  incident: Incident;
  id_it_team: number;
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
  private ticketsUrl = 'data/api/tickets/incidents/all.json';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de tickets desde el archivo JSON simulado.
   * @returns Observable con un array de ITicket[]
   */
  getIncidentTickets(): Observable<IncidentTicket[]> {
    return this.http
      .get<{ data: IncidentTicket[] }>(this.ticketsUrl)
      .pipe(map(response => response.data));
  }

  /**
   * Obtiene la lista categoría de incidentes desde el archivo JSON simulado.
   * @returns Observable con un array de IncidentCategory[]
   */
  getIncidentCategory(): Observable<IncidentCategory[]> {
    const incidents$ = this.http.get<{ data: Incident[] }>('data/api/incidents/all.json');
    const categories$ = this.http.get<{ data: Category[] }>('data/api/incidents/categories.json');

    const mergeData = (incidents: Incident[], categories: Category[]) => {
      return categories.map(category => {
        return {
          ...category,
          incidents: incidents.filter(({ category_id }) => category_id === category.id),
        };
      });
    };

    return forkJoin([incidents$, categories$]).pipe(
      map(([incidents, categories]) => mergeData(incidents.data, categories.data))
    );
  }
}
