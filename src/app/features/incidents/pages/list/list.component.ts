import { Component, inject, OnInit } from '@angular/core';
import { FiltersComponent } from '@features/incidents/components/filters/filters.component';
import { IncidentTableComponent } from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService, Ticket } from '@features/incidents/services/incident.service';
import { ActionsComponent } from '../../components/actions/actions.component';
import { User } from '@core';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);

  idItTeam = 0;
  incidents: Ticket[] = [];

  ngOnInit(): void {
    this.getIncidentTickets();
    this.idItTeam = this.getIdItTeam({}); // add user
  }

  getIncidentTickets() {
    this.incidentService.getTickets().subscribe({
      next: data => {
        this.incidents = data;
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }

  getIdItTeam(user: User): number {
    // get id IT Team from user
    return 0;
  }
}
