import { Component, inject, Input, OnInit } from '@angular/core';
import { FiltersComponent, IncidentTicketFilter } from '@features/incidents/components/filters/filters.component';
import {
  IncidentTableComponent,
  TicketRow,
} from '@features/incidents/components/incident-table/incident-table.component';
import {
  IncidentService,
  IncidentTicketResponse,
} from '@features/incidents/services/incident.service';
import { ActionsComponent } from '../../components/actions/actions.component';
import { User } from '@core/authentication/interface';
import { AuthService } from '@core/authentication/auth.service';
import { Observable } from 'rxjs';
import { mapIncidentTicketToRowTicket } from '@features/incidents/utils/mappers';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly authService = inject(AuthService);
  private user$: Observable<User> = this.authService.user();
  @Input({required: true}) filter!: IncidentTicketFilter;

  idItTeam = 0;
  ticketRows: TicketRow[] = [];

  ngOnInit(): void {
    this.user$.subscribe({
      next: user => {
        this.idItTeam = this.getIdItTeam(user);
        this.getTicketRows({ id_it_team: user.id_it_team });
      },
    });
  }

  getTicketRows(filter?: IncidentTicketFilter) {
    this.incidentService.getIncidentTickets(filter).subscribe({
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
