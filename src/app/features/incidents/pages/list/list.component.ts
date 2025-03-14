import { Component, inject, OnInit } from '@angular/core';
import { FiltersComponent } from '@features/incidents/components/filters/filters.component';
import { IncidentTableComponent } from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService, Ticket } from '@features/incidents/services/incident.service';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent],
  templateUrl: './list.component.html',
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
