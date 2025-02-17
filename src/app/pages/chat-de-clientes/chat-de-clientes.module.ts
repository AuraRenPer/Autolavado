import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDeClientesPageRoutingModule } from './chat-de-clientes-routing.module';

import { ChatDeClientesPage } from './chat-de-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDeClientesPageRoutingModule
  ],
  declarations: [ChatDeClientesPage]
})
export class ChatDeClientesPageModule {}
