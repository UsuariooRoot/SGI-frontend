import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncidentService } from '@features/incidents/services/incident.service';
import { SelectComponent } from "@shared/components/select/select.component";
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { User } from '@core/authentication/interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  imports: [
    SelectComponent,
    ReactiveFormsModule,
],
})
export class CreateComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  private destroy$ = new Subject<void>();

  ticketForm = this.formBuilder.group({
    incidentId: ['', Validators.required],
    description: ['']
  })

  user = {} as User;
  incidentCategory = []

  ngOnInit(): void {
    this.authService.user().pipe(take(1))
      .pipe(
        takeUntil(this.destroy$),
        filter(user => !!user.employee_id)
      )
      .subscribe({
        next: (user) => {
          this.user = user as User;
          this.getIncidentOptions()
        },
        error: err => {
          this.toastr.error('Error en la inicialización del componente:', err)
        },
      });
  }

  submit() {
    if (!this.user.employee_id) {
      return;
    }

    const form = {
      incidentId: Number(this.ticketForm.get('incidentId')?.value),
      description: this.ticketForm.get('description')?.value ?? '',
      employeeId: this.user.employee_id,
    }

    this.incidentService.createIncidentTicket(form).subscribe({
      next: () => {
        this.router.navigate(['/incidents/owned']);
      },
      error: (error) => {
        console.error('Error al crear ticket:', error);
      }
    });
  }


  private getIncidentOptions() {
    this.incidentService.getIncidentCategory().subscribe({
      next: data => {
        const incidentList: any = [];

        for (const { name: categoryName, incidents } of data) {
          for (const { id, description } of incidents) {
            incidentList.push({ id, name: description, categoryName });
          }
        }

        this.incidentCategory = incidentList;
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }
}
