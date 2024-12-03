import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el guard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'panel-control', // Redirigir a 'panel-control' como la página principal
    pathMatch: 'full'
  },
  {
    path: 'panel-control',
    loadChildren: () => import('./panel-control/panel-control.module').then(m => m.PanelControlPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'calendario-citas',
    loadChildren: () => import('./calendario-citas/calendario-citas.module').then(m => m.CalendarioCitasPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'perfil-paciente',
    loadChildren: () => import('./perfil-paciente/perfil-paciente.module').then(m => m.PerfilPacientePageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'consultas-pasadas',
    loadChildren: () => import('./consultas-pasadas/consultas-pasadas.module').then(m => m.ConsultasPasadasPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
