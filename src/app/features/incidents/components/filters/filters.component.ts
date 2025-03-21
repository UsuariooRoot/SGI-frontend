import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterService } from '@features/incidents/services/filter.service';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { ToastrService } from 'ngx-toastr';

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

export interface IncidentTicketFilters {
  ticketStatuses: number[];
  idItEmployee: number;
  idRequesterEmployee: number;
  from: string;
  to: string;
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
    MatButtonModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  private readonly filterService = inject(FilterService);

  @Input({ required: true }) idItTeam!: number;

  TICKET_STATUSES: TicketStatus[] = [];
  itTeamEmployees: ItTeamEmployee[] = [];
  requesterEmployees: RequesterEmployee[] = [];

  ngOnInit(): void {
    this.getIncidentTicketStatuses();
    this.getEmployeesByItTeam(this.idItTeam);
    this.getRequestersByItTeam(this.idItTeam);
  }

  getEmployeesByItTeam(idItTeam: number) {
    return this.filterService.getEmployeesByItTeam(idItTeam).subscribe({
      next: data => {
        this.itTeamEmployees = data;
      },
      error: err => console.error('Error al obtener empleados por equipo TI:', err),
    });
  }

  getRequestersByItTeam(idItTeam: number) {
    return this.filterService.getRequestersByItTeam(idItTeam).subscribe({
      next: data => {
        this.requesterEmployees = data;
      },
      error: err => console.error('Error al obtener solicitantes por equipo de TI:', err),
    });
  }

  getIncidentTicketStatuses() {
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
