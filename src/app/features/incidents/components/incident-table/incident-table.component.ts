import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';


export interface TicketRow {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  reported_by: string;
  assigned_to: null | string;
}

@Component({
  selector: 'app-incident-table',
  templateUrl: './incident-table.component.html',
  styleUrl: './incident-table.component.scss',
  imports: [
    MtxGridModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentTableComponent {
  columns: MtxGridColumn[] = [
    { header: 'Ticket ID', field: 'id' },
    { header: 'Título', field: 'title' },
    { header: 'Descripción', field: 'description' },
    {
      header: 'Fecha creación',
      field: 'created_at',
      formatter: (data) => {
        const date = new Date(data.created_at)

        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }

        return date.toLocaleString("es-ES", options).replace(",", "");
      }
    },
    { header: 'Estado', field: 'status' },
    { header: 'Usuario', field: 'reported_by' },
    { header: 'Asignado', field: 'assigned_to' },
  ];

  @Input() ticketRows: TicketRow[] = [];

}
