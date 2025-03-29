import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesProveedorPageRoutingModule } from './solicitudes-proveedor-routing.module';

import { SolicitudesProveedorPage } from './solicitudes-proveedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesProveedorPageRoutingModule
  ],
  declarations: [SolicitudesProveedorPage]
})
export class SolicitudesProveedorPageModule {}
