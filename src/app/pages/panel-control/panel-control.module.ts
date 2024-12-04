import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelControlPageRoutingModule } from './panel-control-routing.module';

import { PanelControlPage } from './panel-control.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelControlPageRoutingModule
  ],
  declarations: [PanelControlPage]
})
export class PanelControlPageModule {}
