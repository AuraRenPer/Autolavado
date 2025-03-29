import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroProveedorPage } from './registro-proveedor.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroProveedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroProveedorPageRoutingModule {}
