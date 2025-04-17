import { Component } from '@angular/core';
import { FormSectionComponent } from './form-section.component';

interface FormField {
  type: 'select' | 'textarea';
  id: string;
  label: string;
  placeholder?: string;
  options?: {value: string, label: string}[];
}

interface FormConfig {
  title: string;
  fields: FormField[];
  submitLabel: string;
}

@Component({
  selector: 'app-actions',
  imports: [FormSectionComponent],
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {

  currentAction = 'change-status';

  actions = [
    { id: 'change-status', label: 'Cambiar estado' },
    { id: 'change-priority', label: 'Cambiar prioridad' },
    { id: 'assign', label: 'Asignar' },
    { id: 'others', label: 'Otros' }
  ];

  otherActions = [
    'Ver incidente',
    'Ver historico',
    'Descargar como PDF',
    'Adjuntar archivo',
    'Notificar por correo',
    'Reportar'
  ];

  formConfigs: Record<string, FormConfig> = {
    'change-status': {
      title: 'Cambiar estado',
      fields: [
        {
          type: 'select',
          id: 'new-status',
          label: 'Nuevo estado:',
          options: [
            { value: '', label: 'Seleccionar estado' },
            { value: 'resolved', label: 'Atendido' },
            { value: 'closed', label: 'Cerrado' },
            { value: 'cancelled', label: 'Cancelado' }
          ]
        },
        {
          type: 'textarea',
          id: 'status-comment',
          label: 'Comentario:',
          placeholder: 'Agregar comentario sobre el cambio de estado...'
        }
      ],
      submitLabel: 'Aplicar'
    },
    'change-priority': {
      title: 'Cambiar prioridad',
      fields: [
        {
          type: 'select',
          id: 'new-priority',
          label: 'Nueva prioridad:',
          options: [
            { value: '', label: 'Seleccionar prioridad' },
            { value: 'low', label: 'Baja' },
            { value: 'medium', label: 'Media' },
            { value: 'high', label: 'Alta' },
            { value: 'critical', label: 'Crítica' }
          ]
        },
        {
          type: 'textarea',
          id: 'status-comment',
          label: 'Comentario:',
          placeholder: 'Agregar comentario sobre el cambio de prioridad...'
        }
      ],
      submitLabel: 'Aplicar'
    },
    'assign': {
      title: 'Asignar',
      fields: [
        {
          type: 'select',
          id: 'assign-employee',
          label: 'Asignar a:',
          options: [
            { value: '', label: 'Seleccionar empleado' },
            { value: '1', label: 'Ana Gómez' },
            { value: '2', label: 'Carlos Ruiz' },
            { value: '3', label: 'Laura Martínez' },
            { value: '4', label: 'Miguel Torres' },
            { value: '5', label: 'Patricia Vega' }
          ]
        },
        {
          type: 'textarea',
          id: 'assign-comment',
          label: 'Instrucciones para el asignado:',
          placeholder: 'Agregar instrucciones o información relevante...'
        }
      ],
      submitLabel: 'Asignar'
    }
  };


  showAction(action: string) {
    this.currentAction = action;
  }

}
