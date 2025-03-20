import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ItTeamEmployee,
  RequesterEmployee,
  TicketStatus,
} from '../components/filters/filters.component';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private readonly assignedEmployeesUrl = 'data/api/it-team/id/employees/employees-by-it-team.json';
  private readonly requesterEmployeesUrl =
    'data/api/it-team/id/requesters/requesters-by-it-team.json';
  private readonly ticketStatusesUrl = 'data/api/incidents/statuses/statuses.json';

  private readonly http = inject(HttpClient);

  getRequestersByItTeam(idItTeam: number): Observable<RequesterEmployee[]> {
    return this.http
      .get<{ data: RequesterEmployee[] }>(this.requesterEmployeesUrl)
      .pipe(map(response => response.data));
  }

  getEmployeesByItTeam(idItTeam: number): Observable<ItTeamEmployee[]> {
    return this.http
      .get<{ data: ItTeamEmployee[] }>(this.assignedEmployeesUrl)
      .pipe(map(response => response.data));
  }

  getIncidentTicketStatuses(): Observable<TicketStatus[]> {
    return this.http.get<{ data: TicketStatus[] }>(this.ticketStatusesUrl).pipe(
      map(response =>
        response.data.map(ticket => {
          return { ...ticket, active: false };
        })
      )
    );
  }
}
