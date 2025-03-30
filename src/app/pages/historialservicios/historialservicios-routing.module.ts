import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialserviciosPage } from './historialservicios.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialserviciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialserviciosPageRoutingModule {}
