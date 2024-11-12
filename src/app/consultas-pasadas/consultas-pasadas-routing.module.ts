import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultasPasadasPage } from './consultas-pasadas.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultasPasadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultasPasadasPageRoutingModule {}
