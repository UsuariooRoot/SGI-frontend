import { Component, OnInit } from '@angular/core';
import { IncidentTableComponent } from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService, Ticket } from '@features/incidents/services/incident.service';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  incidents: Ticket[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe({
      next: data => {
        this.incidents = data;
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }
}
