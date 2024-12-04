import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultoriosCercanosPageRoutingModule } from './consultorios-cercanos-routing.module';

import { ConsultoriosCercanosPage } from './consultorios-cercanos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultoriosCercanosPageRoutingModule
  ],
  declarations: [ConsultoriosCercanosPage]
})
export class ConsultoriosCercanosPageModule {}
