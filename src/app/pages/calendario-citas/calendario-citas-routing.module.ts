import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioCitasPage } from './calendario-citas.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioCitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioCitasPageRoutingModule {}
