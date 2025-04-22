import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '@features/incidents/services/incident.service';
import { ToastrService } from 'ngx-toastr';
import { SelectComponent } from "../../../../shared/components/select/select.component";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  imports: [
    SelectComponent,
    FormsModule,
],
})
export class CreateComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly toast = inject(ToastrService);

  newIncident = {
    incident: '',
    description: '',
  };

  incidentCategory = []

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

        console.log(incidentList)
        this.incidentCategory = incidentList;
      },
      error: err => console.error('Error al obtener incidentes:', err),
    });
  }
}
