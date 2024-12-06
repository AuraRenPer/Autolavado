import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDePacientesPageRoutingModule } from './chat-de-pacientes-routing.module';

import { ChatDePacientesPage } from './chat-de-pacientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDePacientesPageRoutingModule
  ],
  declarations: [ChatDePacientesPage]
})
export class ChatDePacientesPageModule {}
