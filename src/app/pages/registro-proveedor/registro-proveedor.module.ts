import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroProveedorPageRoutingModule } from './registro-proveedor-routing.module';

import { RegistroProveedorPage } from './registro-proveedor.page';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistroProveedorPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [RegistroProveedorPage]
})
export class RegistroProveedorPageModule {}
