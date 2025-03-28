import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ItTeamEmployee,
  RequesterEmployee,
  TicketStatus,
} from '../components/filters/filters.component';
import { Employee } from '../typings';

@Injectable({
  providedIn: 'root',
})
export class FilterService {

  private readonly http = inject(HttpClient);

  getEmployeesByItTeam(idItTeam: number): Observable<Employee[]> {
    const params = new HttpParams().set('id_it_team', idItTeam);
    return this.http
      .get<{ data: Employee[] }>("api/employees", { params})
      .pipe(map(response => response.data));
  }

  getRequestersByItTeam(idItTeam: number): Observable<Employee[]> {
    const params = new HttpParams().set('id_it_team', idItTeam);
    return this.http
      .get<{ data: Employee[] }>("api/requesters", { params })
      .pipe(map(response => response.data));
  }


  getIncidentTicketStatuses(): Observable<TicketStatus[]> {
    return this.http.get<{ data: TicketStatus[] }>('api/tickets/statuses').pipe(
      map(response =>
        response.data.map(status => {
          return { ...status, active: false };
        })
      )
    );
  }
}
