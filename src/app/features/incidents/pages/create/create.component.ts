import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IncidentService } from '@features/incidents/services/incident.service';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { FormlyModule } from '@ngx-formly/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    FormlyModule,
    MtxSelectModule,
    MatFormFieldModule,
  ],
})
export class CreateComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly toast = inject(ToastrService);

  newIncident = {
    incident: '',
    description: '',
  };

  incidentCategory: any[] = [];

  selectedIncident: any = null;

  submit() {
    this.toast.success(JSON.stringify(this.newIncident));
  }

  ngOnInit() {
    this.getIncidentOptions();
  }

  getIncidentOptions() {
    this.incidentService.getIncidentCategory().subscribe({
      next: data => {
        const incidentList: any = [];

        for (const { name: categoryName, incidents } of data) {
          for (const { id, name } of incidents) {
            incidentList.push({ id, name, categoryName });
          }
        }

        this.incidentCategory = incidentList;
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }
}
