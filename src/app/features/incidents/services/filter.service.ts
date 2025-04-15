import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Employee, TicketStatus } from '../typings';
import { IncidentTicketFilter } from '../components/filters/filters.component';
import { PERSONAL_EMPLOYEES, REQUESTER_EMPLOYEES, TICKET_STATUSES } from '../data/filter-data';

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

  getEmployeesByItTeam(idItTeam: number): Observable<Employee[]> {
    return of(PERSONAL_EMPLOYEES);
    /*
    const params = new HttpParams().set('id_it_team', idItTeam);
    return this.http
      .get<{ data: Employee[] }>("api/employees", { params})
      .pipe(map(response => response.data));
    */
  }

  getRequestersByItTeam(idItTeam: number): Observable<Employee[]> {
    return of(REQUESTER_EMPLOYEES);
    /*
    const params = new HttpParams().set('id_it_team', idItTeam);
    return this.http
      .get<{ data: Employee[] }>("api/requesters", { params })
      .pipe(map(response => response.data));
    */
  }


  getIncidentTicketStatuses(): Observable<TicketStatus[]> {
    return of(TICKET_STATUSES);
    /*
    return this.http.get<{ data: TicketStatus[] }>('api/tickets/statuses').pipe(
      map(response => {
        return response.data
      })
    );
    */
  }
}
