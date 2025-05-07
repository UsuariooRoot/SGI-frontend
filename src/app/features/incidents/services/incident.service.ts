import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, Incident, ItTeam } from '../typings';
import { IncidentTicketFilter } from '../components/filters/filters.component';

export interface TicketResponse {
  id:               number;
  creator:          Employee;
  owner:            Employee;
  incident:         Incident;
  description:      string;
  currentHistoryId: number;
  assignedEmployee: null | Employee;
  status:           ItTeam;
  priority:         ItTeam;
  itTeam:           ItTeam;
  created:          Date;
}

export interface IncidentCategory {
  id: number;
  name: string;
  itTeam: ItTeam;
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

  getIncidentTickets(filter: IncidentTicketFilter, itTeamId: number): Observable<TicketResponse[]> {
    let params = new HttpParams();

    params = params.set('itTeamId', itTeamId)
    const filterParameters = Object.entries(filter);
    filterParameters.forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      params = params.set(key, value);
    });

    return this.http
      .get<{ data: TicketResponse[] }>('http://localhost:8080/api/tickets', { params })
      .pipe(map(response => response.data));
  }

  getIncidentTicketsByRequester(employeeId: number): Observable<TicketResponse[]> {
    return this.http.get<{ data: TicketResponse[] }>(`http://localhost:8080/api/tickets/requester/${employeeId}`)
      .pipe(map(response => response.data));
  }

  getIncidentCategory(): Observable<IncidentCategory[]> {
    return this.http
      .get<{ data: IncidentCategory[] }>('http://localhost:8080/api/incidents/categorized')
      .pipe(map(response => response.data));
  }
}
