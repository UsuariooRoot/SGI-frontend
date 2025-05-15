import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SelectComponent } from '@shared/components/select/select.component';
import { FilterService } from '@features/incidents/services/filter.service';
import { ToastrService } from 'ngx-toastr';

interface ActionTicketForm {
  employeeId: number;
  ticketId: number;
  actionId: number;
  updateValue: number;
  comment: string;
}

interface GeneralAction {
  id: number;
  name: string;
  label: string;
  options: { value: number; label: string }[];
  selectPlaceholder: string;
  commentPlaceholder: string;
}

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectComponent],
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  private readonly http = inject(HttpClient);
  private readonly filterService = inject(FilterService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);

  @Output() actionDone = new EventEmitter<void>();
  @Input() ticketId: number = 0;
  @Input({ required: true }) employeeId!: number;

  actions: GeneralAction[] = [
    {
      id: 1,
      name: 'Cambiar estado',
      label: 'Nuevo estado',
      options: [
        { value: 1, label: 'Pendiente' },
        { value: 3, label: 'Atendido' },
        { value: 4, label: 'Cancelado' },
      ],
      selectPlaceholder: 'Nuevo estado',
      commentPlaceholder: 'Agregar comentario sobre el cambio de estado...',
    },
    {
      id: 2,
      name: 'Cambiar prioridad',
      label: 'Nueva prioridad',
      options: [
        { value: 1, label: 'Baja' },
        { value: 2, label: 'Media' },
        { value: 3, label: 'Alta' },
        { value: 4, label: 'Crítica' },
      ],
      selectPlaceholder: 'Nueva prioridad',
      commentPlaceholder: 'Agregar comentario sobre el cambio de prioridad...',
    },
    {
      id: 3,
      name: 'Asignar',
      label: 'Asignar a',
      options: [],
      selectPlaceholder: 'Asignar a',
      commentPlaceholder: 'Agregar instrucciones o información relevante...',
    },
  ];
  currentAction = this.actions[0];

  actionForm = this.formBuilder.group({
    updateValue: [''],
    comment: [''],
  });

  showAction(action: GeneralAction): void {
    this.currentAction = action;
    this.actionForm.reset();
  }

  cancelAction(): void {
    this.actionForm.reset();
  }

  submitAction(): void {
    const updateValue = Number(this.actionForm.get('updateValue')?.value);

    if (this.ticketId === 0) {
      this.toastr.error('No hay ticket seleccionado');
      return;
    }

    if (updateValue === 0) {
      this.toastr.error('Seleccione una opción');
      return;
    }

    const action: ActionTicketForm = {
      employeeId: this.employeeId,
      ticketId: this.ticketId,
      actionId: this.currentAction.id,
      updateValue,
      comment: this.actionForm.get('comment')?.value ?? '',
    };

    console.log('action: ' + JSON.stringify(action));
    // this.executeAction(action);
  }

  executeAction(action: ActionTicketForm) {
    this.http
      .post('http://localhost:8080/api/tickets/action', action, {
        responseType: 'text',
      })
      .subscribe({
        next: response => {
          this.cancelAction();
          this.actionDone.emit();
        },
        error: error => {
          this.cancelAction();
          this.actionDone.emit();
        },
      });
  }

  executeOtherAction(action: string): void {
    console.log(`Ejecutando acción: ${action}`);
  }

  private loadEmployees(itTeamId: number) {
    this.filterService.getEmployeesByItTeam(itTeamId).subscribe({
      next: data => {
        const actionAssingIndex = this.actions.findIndex(action => action.id === 3);

        this.actions[actionAssingIndex].options = data.map(
          ({ id, name, paternalSurname, maternalSurname }) => {
            return {
              value: id,
              label: `${name} ${paternalSurname} ${maternalSurname}`,
            };
          }
        );
      },
      error: err => console.error('Error al obtener empleados por equipo TI:', err),
    });
  }
}
