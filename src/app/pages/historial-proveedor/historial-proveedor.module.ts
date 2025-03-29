import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialProveedorPageRoutingModule } from './historial-proveedor-routing.module';

import { HistorialProveedorPage } from './historial-proveedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialProveedorPageRoutingModule
  ],
  declarations: [HistorialProveedorPage]
})
export class HistorialProveedorPageModule {}
