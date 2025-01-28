import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutolavadosCercanosPage } from './autolavados-cercanos.page';

const routes: Routes = [
  {
    path: '',
    component: AutolavadosCercanosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutolavadosCercanosPageRoutingModule {}
