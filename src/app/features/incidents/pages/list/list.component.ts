import { Component, OnInit } from '@angular/core';
import { IncidentTableComponent } from "../../components/incident-table/incident-table.component";
import { IncidentService, ITicket } from '@features/incidents/services/incident.service';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  incidents: ITicket[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe({
      next: (data) => {
        this.incidents = data;
      },
      error: (err) => console.error('Error al obtener incidentes:', err)
    });
  }
}
