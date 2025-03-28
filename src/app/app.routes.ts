import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { LoginComponent } from './features/sessions/login/login.component';
import { RegisterComponent } from './features/sessions/register/register.component';
import { GeneralLayoutComponent } from '@layout/general-layout/general-layout.component';
import { ngxPermissionsGuard } from 'ngx-permissions';
import { NoAccessComponent } from '@features/sessions/no-access/no-access.component';

export const routes: Routes = [
  {
    path: 'incidents',
    component: GeneralLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard, ngxPermissionsGuard],
    loadChildren: () => import('./features/incidents/incidents-routing.module').then(m => m.IncidentsRoutingModule)
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'no-access', component: NoAccessComponent },
    ],
  },
  { path: '**', redirectTo: 'incidents' },
];
