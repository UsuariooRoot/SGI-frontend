import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissionsGuard } from '@core/guards/permissions.guard';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { OwnedComponent } from './pages/owned/owned.component';
import { RegisterComponent } from './pages/register/register.component';
import { SearchSolutionComponent } from './pages/search-solution/search-solution.component';

const routes: Routes = [
  {
    path: '',
    data: {
      permissions: {
        only: ['LIDER_EQUIPO_TI', 'EMPLEADO_TI'],
        redirectTo: '/incidents/owned'
      },
    },
    canActivate: [permissionsGuard],
    component: ListComponent, // Path -> "/incidentes"
  },
  {
    path: 'assigned',
    data: {
      permissions: {
        only: ['LIDER_EQUIPO_TI', 'EMPLEADO_TI'],
        redirectTo: '/auth/no-access'
      },
    },
    canActivate: [permissionsGuard],
    component: ListComponent, // Path -> "/incidentes/assigned"
  },
  {
    path: 'owned',
    data: {
      permissions: {
        only: ['EMPLEADO_NO_TI'],
        redirectTo: '/auth/no-access'
      },
    },
    canActivate: [permissionsGuard],
    component: OwnedComponent, // Path -> "/incidentes/owned"
  },
  {
    path: 'create',
    data: {
      permissions: {
        only: ['EMPLEADO_NO_TI'],
        redirectTo: '/auth/no-access'
      },
    },
    canActivate: [permissionsGuard],
    component: CreateComponent, // Path -> "/incidentes/create"
  },
  {
    path: 'register',
    data: {
      permissions: {
        only: ['LIDER_EQUIPO_TI', 'EMPLEADO_TI'],
        redirectTo: '/auth/no-access'
      },
    },
    canActivate: [permissionsGuard],
    component: RegisterComponent, // Path -> "/incidentes/register"
  },
  {
    path: 'search-solution',
    component: SearchSolutionComponent, // Path -> "/incidentes/search-solution"
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentsRoutingModule {}
