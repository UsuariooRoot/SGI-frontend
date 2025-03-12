import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { IncidentService } from '@features/incidents/services/incident.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ITicket {
  id_ticket: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  estado: string;
  reportado_por: string;
  asignado_a: null | string;
}

@Component({
  selector: 'app-incident-table',
  imports: [
    FormsModule,
    MtxGridModule,
    MatCheckboxModule,
    MatCardModule,
    MtxSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './incident-table.component.html',
  styleUrl: './incident-table.component.scss',
})
export class IncidentTableComponent {
  columns: MtxGridColumn[] = [
    { header: 'Ticket ID', field: 'id_ticket' },
    { header: 'Título', field: 'titulo' },
    { header: 'Descripción', field: 'descripcion' },
    { header: 'Fecha creación', field: 'fecha_creacion' },
    { header: 'Estado', field: 'estado' },
    { header: 'Usuario', field: 'reportado_por' },
    { header: 'Asignado', field: 'asignado_a' },
  ];

  empleados = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'Ricardo Gómez' },
    { id: 3, name: 'Angela Rosario' },
    { id: 4, name: 'Richard Stalmant' },
    { id: 5, name: 'Camila Sánchez' },
  ];

  solicitantes = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'Ricardo Gómez' },
    { id: 3, name: 'Angela Rosario' },
    { id: 4, name: 'Richard Stalmant' },
    { id: 5, name: 'Camila Sánchez' },
  ];

  @Input() incidents: ITicket[] = [];

  rowHover = true;
  rowStriped = true;
  showNewTickets = false;
  showPendingTickets = false;
  showCanceledTickets = false;
  showAttendedTickets = false;
  showTicketsIssuedToSD = false;
}
