import { Component, inject, OnDestroy } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { User } from '@core/authentication/interface';
import { FiltersComponent, IncidentTicketFilter } from '@features/incidents/components/filters/filters.component';
import {
  IncidentTableComponent,
  TicketRow,
} from '@features/incidents/components/incident-table/incident-table.component';
import { FilterService } from '@features/incidents/services/filter.service';
import { IncidentService } from '@features/incidents/services/incident.service';
import { mapIncidentTicketToRowTicket } from '@features/incidents/utils/mappers';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-owned',
  imports: [IncidentTableComponent, FiltersComponent],
  templateUrl: './owned.component.html',
  styleUrl: './owned.component.scss',
})
export class OwnedComponent implements OnDestroy {
  private readonly incidentService = inject(IncidentService);
  private readonly authService = inject(AuthService);
  private filterService = inject(FilterService);
  private readonly toastr = inject(ToastrService);

  private destroy$ = new Subject<void>();

  user: User = {} as User;
  ticketRows: TicketRow[] = [];
  selectedTicketId = 0;
  loading = false;
  currentFilters: IncidentTicketFilter | null = null;

  ngOnInit(): void {
      // Take the first user value to prevent infinite loops from user changes
      const user$ = this.authService.user().pipe(take(1));

      combineLatest([user$, this.filterService.$currentFilters])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ([user, filters]) => {
            this.user = user as User;
            this.currentFilters = filters;
            this.loadTickets();
          },
          error: err => {
            this.toastr.error('Error en la inicialización del componente:', err)
          },
        });
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTickets() {
    // Check if we have filters and user to load tickets
    if (!this.user?.employee_id || !this.currentFilters) {
      return;
    }

    this.loading = true;

    this.incidentService
      .getIncidentTicketsByRequester(this.currentFilters, this.user.employee_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: tickets => {
          this.ticketRows = tickets.map(ticket => mapIncidentTicketToRowTicket(ticket));
          this.loading = false;
        },
        error: err => {
          this.toastr.error('Error al obtener incidentes:', err)
          this.loading = false;
          this.ticketRows = [];
        },
      });
  }

  onRowSelected(ticketId: number): void {
    this.selectedTicketId = ticketId;
  }
}
