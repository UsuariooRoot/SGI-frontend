import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { IncidentService } from '@features/incidents/services/incident.service';


export interface ITicket {
  id_ticket:      number;
  titulo:         string;
  descripcion:    string;
  fecha_creacion: string;
  estado:         string;
  reportado_por:  string;
  asignado_a:     null | string;
}

@Component({
  selector: 'app-incident-table',
  imports: [FormsModule, MtxGridModule],
  templateUrl: './incident-table.component.html',
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

  @Input() incidents: ITicket[] = [];

  rowHover = true;
  rowStriped = false;
}
