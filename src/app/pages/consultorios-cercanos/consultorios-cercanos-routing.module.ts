import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultoriosCercanosPage } from './consultorios-cercanos.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultoriosCercanosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultoriosCercanosPageRoutingModule {}
