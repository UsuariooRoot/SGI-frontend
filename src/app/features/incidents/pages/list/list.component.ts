import { Component, inject, OnInit } from '@angular/core';
import { FiltersComponent } from '@features/incidents/components/filters/filters.component';
import {
  IncidentTableComponent,
  TicketRow,
} from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService, IncidentTicket } from '@features/incidents/services/incident.service';
import { ActionsComponent } from '../../components/actions/actions.component';
import { User } from '@core/authentication/interface';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);

  idItTeam = 0;
  ticketRows: TicketRow[] = [];

  ngOnInit(): void {
    this.getTicketRows();
    this.idItTeam = this.getIdItTeam({}); // add user
  }

  getTicketRows() {
    this.incidentService.getIncidentTickets().subscribe({
      next: data => {
        this.ticketRows = this.mapIncidentTicketsToRowTickets(data);
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }

  getIdItTeam(user: User): number {
    // get id IT Team from user
    return 0;
  }

  private mapIncidentTicketsToRowTickets (data: IncidentTicket[]): TicketRow[] {
    return data.map(({
      id,
      description,
      created_at,
      assigned_to,
      status,
      incident,
      reported_by,
    }) => {
      return {
        id,
        title: incident.name,
        description,
        status: status.name,
        created_at,
        reported_by: reported_by.fullname,
        assigned_to: assigned_to.fullname
      }
    })
  }
}
