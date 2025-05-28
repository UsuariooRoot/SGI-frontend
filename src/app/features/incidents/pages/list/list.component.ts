import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FiltersComponent,
  IncidentTicketFilter,
} from '@features/incidents/components/filters/filters.component';
import {
  IncidentTableComponent,
  TicketRow,
} from '@features/incidents/components/incident-table/incident-table.component';
import { IncidentService } from '@features/incidents/services/incident.service';
import { ActionsComponent } from '../../components/actions/actions.component';
import { User } from '@core/authentication/interface';
import { AuthService } from '@core/authentication/auth.service';
import { Subject, takeUntil, combineLatest, take } from 'rxjs';
import { mapIncidentTicketToRowTicket } from '@features/incidents/utils/mappers';
import { FilterService } from '@features/incidents/services/filter.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  imports: [IncidentTableComponent, FiltersComponent, ActionsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, OnDestroy {
  private readonly incidentService = inject(IncidentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly filterService = inject(FilterService);
  private readonly toastr = inject(ToastrService);

  private destroy$ = new Subject<void>();

  user: User = {} as User;
  ticketRows: TicketRow[] = [];
  selectedTicketId = 0;
  loading = false;
  currentFilters: IncidentTicketFilter | null = null;

  ngOnInit(): void {
    // Use combineLatest to react when both observables (user and filters) have values
    // Take the first user value to prevent infinite loops from user changes
    // But continue to react to filter changes
    const user$ = this.authService.user().pipe(take(1));

    combineLatest([user$, this.filterService.$currentFilters])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([user, filters]) => {
          // Cast the user to the correct type
          this.user = user as User;
          this.currentFilters = filters;

          // Check if we have a valid IT team
          if (!this.user || !this.user.id_it_team) {
            this.router.navigateByUrl('/incidents/owned');
            return;
          }

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

  /**
  * Loads incident tickets based on the current filters and user.
  */
  loadTickets(): void {
    // Check if we have filters and user to load tickets
    if (!this.user?.id_it_team || !this.currentFilters) {
      return;
    }

    this.loading = true;

    this.incidentService
      .getIncidentTickets(this.currentFilters, this.user.id_it_team)
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
