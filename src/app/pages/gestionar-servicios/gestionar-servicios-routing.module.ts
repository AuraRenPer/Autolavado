import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionarServiciosPage } from './gestionar-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionarServiciosPageRoutingModule {}
