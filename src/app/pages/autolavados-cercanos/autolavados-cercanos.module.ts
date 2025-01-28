import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutolavadosCercanosPageRoutingModule } from './autolavados-cercanos-routing.module';

import { AutolavadosCercanosPage } from './autolavados-cercanos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutolavadosCercanosPageRoutingModule
  ],
  declarations: [AutolavadosCercanosPage]
})
export class AutolavadosCercanosPageModule {}
