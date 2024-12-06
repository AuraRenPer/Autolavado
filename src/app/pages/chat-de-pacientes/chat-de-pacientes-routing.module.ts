import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDePacientesPage } from './chat-de-pacientes.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDePacientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDePacientesPageRoutingModule {}
