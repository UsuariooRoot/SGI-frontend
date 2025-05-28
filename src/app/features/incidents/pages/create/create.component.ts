import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncidentService } from '@features/incidents/services/incident.service';
import { SelectComponent } from "@shared/components/select/select.component";
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { Observable } from 'rxjs';
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
  private $user: Observable<User> = this.authService.user();

  ticketForm = this.formBuilder.group({
    incidentId: ['', Validators.required],
    description: ['']
  })

  empoyeeId = 0;

  incidentCategory = []

  submit() {
    if (this.empoyeeId === 0) {
      this.toastr.error('No se ha podido obtener el ID del empleado.');
      return;
    }

    const form = {
      incidentId: Number(this.ticketForm.get('incidentId')?.value),
      description: this.ticketForm.get('description')?.value ?? '',
      employeeId: this.empoyeeId,
    }

    this.incidentService.createIncidentTicket(form).subscribe({
      next: (response) => {
        this.router.navigate(['/incidents/owned']);
      },
      error: (error) => {
        console.error('Error al crear ticket:', error);
      }
    });
  }

  ngOnInit() {
    this.$user.subscribe({
      next: user => {
        this.empoyeeId = user.employee_id ?? 0;
      },
    });
    this.getIncidentOptions();
  }

  getIncidentOptions() {
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
