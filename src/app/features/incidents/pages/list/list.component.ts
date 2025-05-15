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
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private $user: Observable<User> = this.authService.user();
  private filterService = inject(FilterService);

  @Input({ required: true }) filters!: IncidentTicketFilter;

  user: User = {}
  ticketRows: TicketRow[] = [];
  selectedTicketId = 0;

  ngOnInit(): void {
    this.$user.subscribe({
      next: user => {
        if (user.id_it_team === 0) {
          this.router.navigateByUrl('/incidents/owned')
        }
        this.user = user;
        this.loadTickets(this.filters);
      },
    });
    this.filterService.$currentFilters.subscribe(filters => {
      this.loadTickets(filters);
    });
  }

  loadTicketRows(filter: IncidentTicketFilter) {
    if (!this.user.id_it_team) return;
    this.incidentService.getIncidentTickets(filter, this.user.id_it_team).subscribe({
      next: data => {
        this.ticketRows = data.map(ticket => mapIncidentTicketToRowTicket(ticket));
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }

  private loadTickets(filters: IncidentTicketFilter) {
    if (!this.user.id_it_team) return;
    this.incidentService.getIncidentTickets(filters, this.user.id_it_team).subscribe(tickets => {
      this.ticketRows = tickets.map(ticket => mapIncidentTicketToRowTicket(ticket));
    });
  }

  onRowSelected(ticketId: number) {
    this.selectedTicketId = ticketId;
  }

  // Expose loadTickets for use from the template
  reloadTickets() {
    console.log("recargando")
    this.loadTickets(this.filters);
  }
}
