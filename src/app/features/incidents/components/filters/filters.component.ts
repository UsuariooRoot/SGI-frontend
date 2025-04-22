import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterService } from '@features/incidents/services/filter.service';
import { Employee } from '@features/incidents/typings';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { SelectComponent } from "@shared/components/select/select.component";

export interface GenericEmployee {
  id: number;
  fullName: string;
}

export interface TicketStatus {
  id: number;
  name: string;
  active?: boolean;
}

export interface IncidentTicketFilter {
  news?: boolean;
  statuses?: number[];
  id_it_team?: number;
  assigned_employee?: number;
  employee_owner?: number;
  from?: Date;
  to?: Date;
}

@Component({
  selector: 'app-filters',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    SelectComponent,
    // MtxSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxPermissionsModule,
    SelectComponent
],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  private readonly filterService = inject(FilterService);
  private readonly toast = inject(ToastrService);


  @Input({ required: true }) idItTeam!: number;

  TICKET_STATUSES: TicketStatus[] = [];
  IT_TEAM_EMPLOYEES: Employee[] = [];
  REQUESTER_EMPLOYEES: Employee[] = [];

  statuses: any = [];
  filters: IncidentTicketFilter = {};

  ngOnInit() {
    this.getIncidentTicketStatuses();
    this.getEmployeesByItTeam(this.idItTeam);
    this.getRequestersByItTeam(this.idItTeam);
  }

  private getEmployeesByItTeam(idItTeam: number) {
    return this.filterService.getEmployeesByItTeam(idItTeam).subscribe({
      next: data => {
        this.IT_TEAM_EMPLOYEES = data;
      },
      error: err => console.error('Error al obtener empleados por equipo TI:', err),
    });
  }

  private getRequestersByItTeam(idItTeam: number) {
    return this.filterService.getRequestersByItTeam(idItTeam).subscribe({
      next: data => {
        this.REQUESTER_EMPLOYEES = data;
      },
      error: err => console.error('Error al obtener solicitantes por equipo de TI:', err),
    });
  }

  private getIncidentTicketStatuses() {
    this.filterService.getIncidentTicketStatuses().subscribe({
      next: statuses => {
        const formattedStatuses: TicketStatus[] = statuses.map(status => {
          return { ...status, active: false };
        });
        const newStatus: TicketStatus = {
          id: 0,
          name: 'Nuevo',
          active: false,
        };
        this.TICKET_STATUSES = [newStatus, ...formattedStatuses];
        this.statuses = JSON.stringify(this.TICKET_STATUSES);
      },
      error: err => console.error('Error al obtener los estados de los ticket de incidentes:', err),
    });
  }

  applyFilters() {
    const statuses = this.TICKET_STATUSES.filter(ticket => ticket.active).map(ticket => ticket.id);

    this.filters.statuses = statuses;

    this.toast.success(JSON.stringify(this.filters));
  }

  cleanFilters() {
    this.TICKET_STATUSES = JSON.parse(this.statuses);
    this.filters = {};
  }
}
