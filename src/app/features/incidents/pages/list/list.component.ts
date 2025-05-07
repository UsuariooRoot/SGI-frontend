import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FiltersComponent,
  IncidentTicketFilter,
} from '@features/incidents/components/filters/filters.component';
import {
  IncidentTableComponent,
  TicketRow,
} from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService } from '@features/incidents/services/incident.service';
import { ActionsComponent } from '../../components/actions/actions.component';
import { User } from '@core/authentication/interface';
import { AuthService } from '@core/authentication/auth.service';
import { Observable } from 'rxjs';
import { mapIncidentTicketToRowTicket } from '@features/incidents/utils/mappers';
import { FilterService } from '@features/incidents/services/filter.service';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly authService = inject(AuthService);
  private $user: Observable<User> = this.authService.user();
  private filterService = inject(FilterService);

  @Input({ required: true }) filters!: IncidentTicketFilter;

  itTeamId = 0;
  ticketRows: TicketRow[] = [];

  ngOnInit(): void {
    this.$user.subscribe({
      next: user => {
        this.itTeamId = user.id_it_team ?? 0;
        this.loadTickets(this.filters, this.itTeamId);
      },
    });
    this.filterService.$currentFilters.subscribe(filters => {
      this.loadTickets(filters, this.itTeamId);
    });
  }

  getTicketRows(filter: IncidentTicketFilter) {
    this.incidentService.getIncidentTickets(filter, this.itTeamId).subscribe({
      next: data => {
        this.ticketRows = data.map(mapIncidentTicketToRowTicket);
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }

  private loadTickets(filters: IncidentTicketFilter, itTeamId: number) {
    this.incidentService.getIncidentTickets(filters, itTeamId).subscribe(tickets => {
      this.ticketRows = tickets.map(ticket => mapIncidentTicketToRowTicket(ticket));
    });
  }
}
