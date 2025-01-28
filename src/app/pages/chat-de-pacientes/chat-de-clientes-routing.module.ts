import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDeClientesPage } from './chat-de-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDeClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDeClientesPageRoutingModule {}
