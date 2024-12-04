import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultasPasadasPageRoutingModule } from './consultas-pasadas-routing.module';

import { ConsultasPasadasPage } from './consultas-pasadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultasPasadasPageRoutingModule
  ],
  declarations: [ConsultasPasadasPage]
})
export class ConsultasPasadasPageModule {}
