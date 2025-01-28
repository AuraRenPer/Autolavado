import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosPasadosPage } from './consultas-pasadas.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosPasadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPasadosPageRoutingModule {}
