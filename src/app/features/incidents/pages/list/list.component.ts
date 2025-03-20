import { Component, inject, OnInit } from '@angular/core';
import { FiltersComponent, ItTeamEmployee, RequesterEmployee } from '@features/incidents/components/filters/filters.component';
import { IncidentTableComponent } from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService, Ticket } from '@features/incidents/services/incident.service';
import { FilterService } from '@features/incidents/services/filter.service';
import { ActionsComponent } from "../../components/actions/actions.component";

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService)

  incidents: Ticket[] = [];

  ngOnInit(): void {
    this.incidentService.getTickets().subscribe({
      next: data => {
        this.incidents = data;
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }
}
