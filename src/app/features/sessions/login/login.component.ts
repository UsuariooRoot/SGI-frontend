import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/auth.service';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MtxButtonModule,
    TranslateModule,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['rogelio', [Validators.required]],
    password: ['123456', [Validators.required]],
    rememberMe: [false],
  });

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  login() {
    this.isSubmitting = true;

    this.auth
      .login(this.username.value, this.password.value, this.rememberMe.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe({
        next: () => {
          // Get user information to determine the appropriate redirect
          this.auth
            .user()
            .pipe(take(1))
            .subscribe(user => {
              let redirectionUrl = '/auth/login';
              if (user && user.role) {
                // Redirect based on user role
                if (user.role === 'EMPLEADO_NO_TI') {
                  redirectionUrl = '/incidents/owned';
                } else if (user.role === 'EMPLEADO_TI' || user.role === 'LIDER_EQUIPO_TI') {
                  redirectionUrl = '/incidents';
                } else {
                  // Default fallback
                  redirectionUrl = '/incidents';
                }
              }

              this.router.navigateByUrl(redirectionUrl);
            });
        },
        error: (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 401) {
            this.loginForm.setErrors({
              remote: errorRes.error.message,
            });
          }
          this.isSubmitting = false;
        },
      });
  }
}
