import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, Incident, ItTeam } from '../typings';
import { IncidentTicketFilter } from '../components/filters/filters.component';

export interface TicketResponse {
  id: number;
  creator: Employee;
  owner: Employee;
  incident: Incident;
  description: string;
  currentHistoryId: number;
  assignedEmployee: null | Employee;
  status: ItTeam;
  priority: ItTeam;
  itTeam: ItTeam;
  created: Date;
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

export interface CreateTicketForm {
  incidentId: number;
  employeeId: number;
  description?: string;
}

export interface ActionTicketForm {
  employeeId: number;
  ticketId: number;
  actionId: number;
  updateValue: number;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly http = inject(HttpClient);

  getIncidentTickets(filter: IncidentTicketFilter, itTeamId: number): Observable<TicketResponse[]> {
    let params = new HttpParams();
    params = params.set('itTeamId', itTeamId);
    // to avoid cached requests
    params = params.set('_t', new Date().getTime().toString());

    if (filter && typeof filter === 'object') {
      Object.entries(filter).forEach(([key, value]) => {
        if (Boolean(value)) {
          params = params.set(key, value);
        }
      });
    }

    return this.http
      .get<{ data: TicketResponse[] }>('/api/tickets', {
        params,
        headers: new HttpHeaders({
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }),
      })
      .pipe(map(response => response.data));
  }

  getIncidentTicketsByRequester(
    filter: IncidentTicketFilter,
    employeeId: number
  ): Observable<TicketResponse[]> {
    let params = new HttpParams();

    const filterParameters = Object.entries(filter);
    filterParameters.forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      params = params.set(key, value);
    });

    return this.http
      .get<{
        data: TicketResponse[];
      }>(`/api/tickets/requester/${employeeId}`, { params })
      .pipe(map(response => response.data));
  }

  getIncidentCategory(): Observable<IncidentCategory[]> {
    return this.http
      .get<{ data: IncidentCategory[] }>('/api/incidents/categorized')
      .pipe(map(response => response.data));
  }

  createIncidentTicket(ticket: CreateTicketForm): Observable<TicketResponse> {
    return this.http.post<TicketResponse>('/api/tickets', ticket);
  }

  executeAction(action: ActionTicketForm) {
    return this.http.post<TicketResponse>('/api/tickets/action', action);
  }
}
