import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterService } from '@features/incidents/services/filter.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SelectComponent } from '@shared/components/select/select.component';
import { Employee, TicketStatus } from '@features/incidents/typings';

export interface GenericEmployee {
  id: number;
  fullName: string;
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
  imports: [ReactiveFormsModule, MatDatepickerModule, NgxPermissionsModule, SelectComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  private readonly filterService = inject(FilterService);
  private readonly formBuilder = inject(FormBuilder);

  @Input() itTeamId!: number;

  TICKET_STATUSES: TicketStatus[] = [];
  IT_TEAM_EMPLOYEES: GenericEmployee[] = [];
  REQUESTER_EMPLOYEES: GenericEmployee[] = [];

  filterForm = this.formBuilder.group({
    showNewTickets: [false],
    statusIds: [[] as number[]],
    assignedEmployeeId: [''],
    ownerEmployeeId: [''],
    dateFrom: [''],
    dateTo: [''],
  });

  ngOnInit() {
    this.loadTicketStatuses();
    this.loadEmployees(this.itTeamId);
  }

  private loadEmployees(itTeamId: number) {
    if (itTeamId < 1) return;

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
        this.TICKET_STATUSES = statuses;
      },
      error: err => console.error('Error al obtener los estados de los ticket de incidentes:', err),
    });
  }

  applyFilters() {
    // console.log(this.filterForm.value)
  }

  cleanFilters() {
    this.filterForm.reset({
      showNewTickets: false,
      statusIds: [],
      assignedEmployeeId: '',
      ownerEmployeeId: '',
      dateFrom: '',
      dateTo: '',
    });
  }

  toggleStatusId(statusId: number) {
    const control = this.filterForm.get('statusIds') as any;
    const current: number[] = control?.value || [];

    if (current.includes(statusId)) {
      control?.setValue(current.filter(id => id !== statusId));
    } else {
      control?.setValue([...current, statusId]);
    }
  }

  private mapEmployeeToGenericEmployee(employee: Employee): GenericEmployee {
    return {
      id: employee.id,
      fullName: `${employee.name} ${employee.paternalSurname} ${employee.maternalSurname}`,
    };
  }
}
