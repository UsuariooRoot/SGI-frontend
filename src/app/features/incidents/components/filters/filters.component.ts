import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MtxSelectModule } from '@ng-matero/extensions/select';

@Component({
  selector: 'app-filters',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    MtxSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  readonly empleados = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'Ricardo Gómez' },
    { id: 3, name: 'Angela Rosario' },
    { id: 4, name: 'Richard Stalmant' },
    { id: 5, name: 'Camila Sánchez' },
  ];

  readonly solicitantes = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'Ricardo Gómez' },
    { id: 3, name: 'Angela Rosario' },
    { id: 4, name: 'Richard Stalmant' },
    { id: 5, name: 'Camila Sánchez' },
  ];

  showNewTickets = false;
  showPendingTickets = false;
  showCanceledTickets = false;
  showAttendedTickets = false;
  showTicketsIssuedToSD = false;
  showTicketsIssuedToGAT = false;
}
