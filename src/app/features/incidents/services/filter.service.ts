import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Employee, TicketStatus } from '../typings';
import { IncidentTicketFilter } from '../components/filters/filters.component';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private readonly http = inject(HttpClient);
  private filtersSource = new BehaviorSubject<IncidentTicketFilter>({});
  $currentFilters = this.filtersSource.asObservable();

  updateFilters(filters: any) {
    this.filtersSource.next(filters);
  }

  getEmployeesByItTeam(itTeamId: number): Observable<Employee[]> {
    const params = new HttpParams().set('it_team_id', itTeamId);
    return this.http
      .get<{ data: Employee[] }>('/api/employees', { params })
      .pipe(map(response => response.data));
  }

  getRequestersByItTeam(itTeamId: number): Observable<Employee[]> {
    const params = new HttpParams().set('itTeamId', itTeamId);
    return this.http
      .get<{ data: any[] }>('/api/tickets', { params })
      .pipe(map(response => response.data.map(ticket => ticket.owner as Employee)));
  }

  getIncidentTicketStatuses(): Observable<TicketStatus[]> {
    return this.http
      .get<{ data: TicketStatus[] }>('/api/tickets/statuses')
      .pipe(map(response => response.data));
  }
}
