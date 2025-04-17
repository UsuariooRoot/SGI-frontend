import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="action-content">
      @for (field of formConfig.fields; track field.id) {
        <div class="form-group">
          <label [for]="field.id">{{ field.label }}</label>

          @if (field.type === 'select') {
            <select [id]="field.id" [(ngModel)]="formData[field.id]">
              @for (option of field.options; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
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

      <div class="btn-container">
        <button class="btn btn-secondary" (click)="cancel()">Cancelar</button>
        <button class="btn btn-primary" (click)="submit()">{{ formConfig.submitLabel }}</button>
      </div>
    </div>
  `,
  styles: `
    .action-content {
      padding: 15px 0;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

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

    .btn-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-left: 10px;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-primary {
      background-color: #8b0000;
      color: white;
      border: 1px solid #8b0000;
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
