import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@shared/components/select/select.component';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  template: `
    <div class="form-group">
      @for (field of formConfig.fields; track field.id) {
        <div class="form-field">
          <label>{{ field.label }}</label>

          @if (field.type === 'select') {
            <app-select
              [items]="field.options"
              bindLabel="label"
              bindValue="value"
              [(ngModel)]="formData[field.id]"
              [placeholder]="field.placeholder ?? 'Selecciona una opción'"
            />
          }

          @if (field.type === 'textarea') {
            <textarea
              [id]="field.id"
              [placeholder]="field.placeholder || ''"
              [(ngModel)]="formData[field.id]"
            ></textarea>
          }
        </div>
      }

      <div class="d-flex justify-content-end gap-12">
        <button class="btn-secondary" (click)="cancel()">Cancelar</button>
        <button class="btn-primary" (click)="submit()">{{ formConfig.submitLabel }}</button>
      </div>
    </div>
  `,
  styles: `
    select,
    input,
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }

    textarea {
      height: 100px;
      resize: vertical;
    }
  `,
})
export class FormSectionComponent {
  @Input() formConfig: any;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  formData: Record<string, any> = {};

  cancel() {
    this.onCancel.emit();
  }

  submit() {
    this.onSubmit.emit(this.formData);
  }
}
