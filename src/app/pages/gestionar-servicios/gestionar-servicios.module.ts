import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GestionarServiciosPageRoutingModule } from './gestionar-servicios-routing.module';
import { GestionarServiciosPage } from './gestionar-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarServiciosPageRoutingModule
  ],
  declarations: [GestionarServiciosPage]
})
export class GestionarServiciosPageModule {}
