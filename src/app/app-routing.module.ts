import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'panel-control',  // Redirigir a 'panel-control' como la página principal
    pathMatch: 'full'
  },
  {
    path: 'panel-control',
    loadChildren: () => import('./panel-control/panel-control.module').then(m => m.PanelControlPageModule)
  },
  {
    path: 'calendario-citas',
    loadChildren: () => import('./calendario-citas/calendario-citas.module').then(m => m.CalendarioCitasPageModule)
  },
  {
    path: 'perfil-paciente',
    loadChildren: () => import('./perfil-paciente/perfil-paciente.module').then(m => m.PerfilPacientePageModule)
  },
  {
    path: 'consultas-pasadas',
    loadChildren: () => import('./consultas-pasadas/consultas-pasadas.module').then( m => m.ConsultasPasadasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
