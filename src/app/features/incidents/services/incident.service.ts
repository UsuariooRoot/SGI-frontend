import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, Incident, TicketStatus } from '../typings';
import { IncidentTicketFilter } from '../components/filters/filters.component';
import { INCIDENT_TICKETS } from '../data/todos';

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
  itTeam: {
    id: number;
    name: string;
  };
  incidents: {
    id: number;
    description: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly http = inject(HttpClient);

  getIncidentTickets(filter?: IncidentTicketFilter): Observable<IncidentTicketResponse[]> {
    return of(INCIDENT_TICKETS);
    // let params = new HttpParams();
    // if (filter) {
    //   const filterParameters = Object.entries(filter);
    //   filterParameters.forEach(([key, value]) => {
    //     params = params.set(key, value);
    //   });
    // }

    // return this.http
    //   .get<{ data: IncidentTicketResponse[] }>('http://localhost:8080/api/tickets/incidents', { params })
    //   .pipe(
    //     map(response => {
    //       return response.data;
    //     })
    //   );
  }

  getIncidentCategory(): Observable<IncidentCategory[]> {
    return this.http
      .get<{ data: IncidentCategory[] }>('http://localhost:8080/api/incidents/categorized')
      .pipe(map(response => response.data));
  }
}
