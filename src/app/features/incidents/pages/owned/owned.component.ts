import { Component, inject } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { User } from '@core/authentication/interface';
import { FiltersComponent, IncidentTicketFilter } from '@features/incidents/components/filters/filters.component';
import {
  IncidentTableComponent,
  TicketRow,
} from '@features/incidents/components/incident-table/incident-table.component';
import { FilterService } from '@features/incidents/services/filter.service';
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
  private filterService = inject(FilterService);
  private $user: Observable<User> = this.authService.user();

  employeeId = 0;
  ticketRows: TicketRow[] = [];

  ngOnInit(): void {
    this.$user.subscribe({
      next: user => {
        this.employeeId = user.employee_id ?? 0;
      },
    });
    this.filterService.$currentFilters.subscribe(filters => {
      this.loadTickets(filters);
    });
  }

  private loadTickets(filters: IncidentTicketFilter) {
      this.incidentService.getIncidentTicketsByRequester(filters, this.employeeId).subscribe(tickets => {
        this.ticketRows = tickets.map(ticket => mapIncidentTicketToRowTicket(ticket));
      });
    }

  getIdItTeam(user: User): number {
    return user?.id_it_team ?? 0;
  }
}
