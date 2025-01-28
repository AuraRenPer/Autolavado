import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosPasadosPageRoutingModule } from './consultas-pasadas-routing.module';

import { ServiciosPasadosPage } from './consultas-pasadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosPasadosPageRoutingModule
  ],
  declarations: [ServiciosPasadosPage]
})
export class ServiciosPasadosPageModule {}
