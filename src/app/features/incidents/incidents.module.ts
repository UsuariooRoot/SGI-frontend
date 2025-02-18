import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IncidentsRoutingModule } from './incidents-routing.module';

import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { IncidentService } from './services/incident.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IncidentsRoutingModule,
    ListComponent,
    CreateComponent,
  ],
  providers: [IncidentService]
})
export class IncidentsModule { }
