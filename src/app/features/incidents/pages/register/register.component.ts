import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    MtxSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SearchInputComponent,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {}
