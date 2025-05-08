import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterService } from '@features/incidents/services/filter.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { SelectComponent } from '@shared/components/select/select.component';
import { Employee } from '@features/incidents/typings';

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
  showNewTickets?: boolean;
  statusIds?: number[];
  assignedEmployeeId?: number;
  ownerEmployeeId?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

@Component({
  selector: 'app-filters',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    SelectComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxPermissionsModule,
    SelectComponent,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  private readonly filterService = inject(FilterService);
  private readonly toast = inject(ToastrService);

  @Input() itTeamId?: number;

  TICKET_STATUSES: TicketStatus[] = [];
  IT_TEAM_EMPLOYEES: GenericEmployee[] = [];
  REQUESTER_EMPLOYEES: GenericEmployee[] = [];

  statuses: any = [];
  filters: IncidentTicketFilter = {};

  ngOnInit() {
    this.loadTicketStatuses();
    this.loadEmployees(this.itTeamId ?? 0);
  }

  private loadEmployees(itTeamId: number) {
    this.filterService.getEmployeesByItTeam(itTeamId).subscribe({
      next: data => {
        this.IT_TEAM_EMPLOYEES = data.map(this.mapEmployeeToGenericEmployee);
      },
      error: err => console.error('Error al obtener empleados por equipo TI:', err),
    });

    this.filterService.getRequestersByItTeam(itTeamId).subscribe({
      next: data => {
        this.REQUESTER_EMPLOYEES = data.map(this.mapEmployeeToGenericEmployee);
      },
      error: err => console.error('Error al obtener solicitantes por equipo de TI:', err),
    });
  }

  private loadTicketStatuses() {
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
    const statuses = this.TICKET_STATUSES.filter(({ id, active }) => {
      if (id === 0) {
        this.filters.showNewTickets = true;
        return false;
      }
      return active;
    }).map(ticket => ticket.id);

    this.filters.statusIds = statuses;
    console.log(this.filters);

    this.filterService.updateFilters(this.filters);
  }

  cleanFilters() {
    this.TICKET_STATUSES = JSON.parse(this.statuses);
    this.filters = {};
  }

  private mapEmployeeToGenericEmployee(employee: Employee): GenericEmployee {
    return {
      id: employee.id,
      fullName: `${employee.name} ${employee.paternalSurname} ${employee.maternalSurname}`,
    };
  }
}
