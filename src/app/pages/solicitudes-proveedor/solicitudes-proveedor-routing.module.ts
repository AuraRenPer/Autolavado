import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesProveedorPage } from './solicitudes-proveedor.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesProveedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesProveedorPageRoutingModule {}
