import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent, // Path -> "/incidentes"
  },
  {
    path: 'create',
    component: CreateComponent, // Path -> "/incidentes/create"
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class IncidentsRoutingModule {}
