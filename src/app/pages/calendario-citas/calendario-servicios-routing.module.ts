import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioServiciosPage } from './calendario-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioServiciosPageRoutingModule {}
