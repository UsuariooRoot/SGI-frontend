import { Routes } from '@angular/router';
import { authGuard } from '@core/authentication/auth.guard';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { LoginComponent } from './features/sessions/login/login.component';
import { RegisterComponent } from './features/sessions/register/register.component';
import { GeneralLayoutComponent } from '@layout/general-layout/general-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'incidents',
        loadChildren: () => import('./features/incidents/incidents-routing.module').then(m => m.IncidentsRoutingModule)
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
