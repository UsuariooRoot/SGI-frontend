import { Component, inject, OnInit } from '@angular/core';
import { FiltersComponent } from '@features/incidents/components/filters/filters.component';
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

  idItTeam = 0;
  ticketRows: TicketRow[] = [];

  ngOnInit(): void {
    this.user$.subscribe({
      next: user => {
        this.idItTeam = this.getIdItTeam(user);
        this.getTicketRows();
      },
    });
  }

  getTicketRows() {
    this.incidentService.getIncidentTickets({ idItTeam: this.idItTeam }).subscribe({
      next: data => {
        console.log(data)
        this.ticketRows = data.map(this.mapIncidentTicketToRowTicket);
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }

  getIdItTeam(user: User): number {
    return user?.id_it_team ?? 0;
  }

  private mapIncidentTicketToRowTicket(data: IncidentTicketResponse): TicketRow {
    const { id, created_at, description, incident, reported_by, status, assigned_to } =
      data;

    return {
      id,
      title: incident.name,
      description,
      status: status.name,
      created_at: created_at.toString(),
      reported_by: reported_by.fullname,
      assigned_to: assigned_to?.fullname ?? '---',
    };
  }
}
