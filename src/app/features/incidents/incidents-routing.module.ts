import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { OwnedComponent } from './pages/owned/owned.component';
import { RegisterComponent } from './pages/register/register.component';
import { SearchSolutionComponent } from './pages/search-solution/search-solution.component';

const routes: Routes = [
  {
    path: '',
    // data: {
    //   permissions: {
    //     only: ['IT_EMPLOYEE'],
    //     redirectTo: '/incidents/owned'
    //   },
    // },
    component: ListComponent, // Path -> "/incidentes"
  },
  {
    path: 'owned',
    // data: {
    //   permissions: {
    //     only: ['NON-IT_EMPLOYEE'],
    //     redirectTo: '/auth/no-access'
    //   },
    // },
    component: OwnedComponent, // Path -> "/incidentes/owned"
  },
  {
    path: 'create',
    // data: {
    //   permissions: {
    //     only: ['NON-IT_EMPLOYEE'],
    //     // redirectTo: '/auth/no-access'
    //   },
    // },
    component: CreateComponent, // Path -> "/incidentes/create"
  },
  {
    path: 'register',
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
