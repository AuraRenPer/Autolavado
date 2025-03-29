import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialProveedorPage } from './historial-proveedor.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialProveedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialProveedorPageRoutingModule {}
