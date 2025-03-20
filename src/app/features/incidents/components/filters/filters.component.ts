import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterService } from '@features/incidents/services/filter.service';
import { MtxSelectModule } from '@ng-matero/extensions/select';

export interface RequesterEmployee {
  id: number;
  fullName: string;
}

export interface ItTeamEmployee {
  id: number;
  fullName: string;
}

export interface TicketStatus {
  id: number;
  name: string;
  active?: boolean;
}

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
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  private readonly filterService = inject(FilterService);

  itTeamEmployees: ItTeamEmployee[] = [];
  requesterEmployees: RequesterEmployee[] = [];
  TICKET_STATUSES: TicketStatus[] = [];

  ngOnInit(): void {
    this.filterService.getEmployeesByItTeam(1).subscribe({
      next: data => {
        this.itTeamEmployees = data;
      },
      error: err => console.error('Error al obtener empleados por equipo TI:', err),
    });

    this.filterService.getRequestersByItTeam(1).subscribe({
      next: data => {
        this.requesterEmployees = data;
      },
      error: err => console.error('Error al obtener solicitantes por equipo de TI:', err),
    });

    this.filterService.getIncidentTicketStatuses().subscribe({
      next: data => {
        const newTicketStatus: TicketStatus = {
          id: 0,
          name: 'Nuevo',
          active: false,
        };
        this.TICKET_STATUSES = [newTicketStatus, ...data];
      },
      error: err => console.error('Error al obtener los estados de los ticket de incidentes:', err),
    });
  }
}
