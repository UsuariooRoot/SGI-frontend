import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterService } from '@features/incidents/services/filter.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SelectComponent } from '@shared/components/select/select.component';
import { Employee, TicketStatus } from '@features/incidents/typings';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
export class FiltersComponent implements OnInit, OnChanges, OnDestroy {
  private readonly filterService = inject(FilterService);
  private readonly toastr = inject(ToastrService);
  private readonly formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  @Input({ required: true }) itTeamId!: number;

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

  ngOnChanges(changes: SimpleChanges): void {
    // If the itTeamId changes, we reload the employees
    if (changes['itTeamId'] && !changes['itTeamId'].firstChange && this.itTeamId > 0) {
      this.loadEmployees(this.itTeamId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadEmployees(itTeamId: number): void {
    if (itTeamId < 1) return;

    this.filterService.getEmployeesByItTeam(itTeamId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.IT_TEAM_EMPLOYEES = data.map(this.mapEmployeeToGenericEmployee);
        },
        error: err => this.toastr.error('Error al obtener empleados por equipo TI:', err),
      });

    this.filterService.getRequestersByItTeam(itTeamId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          const employeeIds = new Set();
          this.REQUESTER_EMPLOYEES = data.map(
            this.mapEmployeeToGenericEmployee
          ).filter(({ id }) => {
            if (employeeIds.has(id)) return false;
            employeeIds.add(id);
            return true;
          });
        },
        error: err => this.toastr.error('Error al obtener solicitantes por equipo de TI:', err),
      });
  }

   private loadTicketStatuses(): void {
    this.filterService.getIncidentTicketStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: statuses => {
          this.TICKET_STATUSES = statuses;
        },
        error: err => this.toastr.error('Error al obtener los estados de los ticket de incidentes:', err),
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
