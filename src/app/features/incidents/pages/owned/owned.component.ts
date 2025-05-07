import { Component, inject } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { User } from '@core/authentication/interface';
import { FiltersComponent } from '@features/incidents/components/filters/filters.component';
import {
  IncidentTableComponent,
  TicketRow,
} from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService } from '@features/incidents/services/incident.service';
import { mapIncidentTicketToRowTicket } from '@features/incidents/utils/mappers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-owned',
  imports: [IncidentTableComponent, FiltersComponent],
  templateUrl: './owned.component.html',
  styleUrl: './owned.component.scss',
})
export class OwnedComponent {
  private readonly incidentService = inject(IncidentService);
  private readonly authService = inject(AuthService);
  private $user: Observable<User> = this.authService.user();

  employeeId = 0;
  ticketRows: TicketRow[] = [];

  ngOnInit(): void {
    this.$user.subscribe({
      next: user => {
        this.employeeId = user.employee_id ?? 0;
        this.getTicketRows({ employee_owner: user.id });
      },
    });
  }

  getTicketRows(filter?: any) {
    this.incidentService.getIncidentTicketsByRequester(filter, this.employeeId).subscribe({
      next: data => {
        this.ticketRows = data.map(mapIncidentTicketToRowTicket);
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }

  getIdItTeam(user: User): number {
    return user?.id_it_team ?? 0;
  }
}
