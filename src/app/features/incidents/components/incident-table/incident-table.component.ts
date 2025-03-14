import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FiltersComponent } from '../filters/filters.component';

export interface RowTicket {
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
  templateUrl: './incident-table.component.html',
  styleUrl: './incident-table.component.scss',
  imports: [
    MtxGridModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentTableComponent {
  columns: MtxGridColumn[] = [
    { header: 'Ticket ID', field: 'id_ticket' },
    { header: 'Título', field: 'titulo' },
    { header: 'Descripción', field: 'descripcion' },
    {
      header: 'Fecha creación',
      field: 'fecha_creacion',
      formatter: (data) => {
        const date = new Date(Number(data.fecha_creacion))

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
    { header: 'Estado', field: 'estado' },
    { header: 'Usuario', field: 'reportado_por' },
    { header: 'Asignado', field: 'asignado_a' },
  ];

  @Input() incidents: RowTicket[] = [];

}
