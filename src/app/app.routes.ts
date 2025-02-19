import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayoutComponent } from '@layout/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { LoginComponent } from './routes/sessions/login/login.component';
import { RegisterComponent } from './routes/sessions/register/register.component';
import { GeneralLayoutComponent } from '@layout/general-layout/general-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'incidentes',
        loadChildren: () => import('./features/incidents/incidents.module').then(m => m.IncidentsModule)
      },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
