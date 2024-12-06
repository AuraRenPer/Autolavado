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
    loadChildren: () => import('./pages/panel-control/panel-control.module').then(m => m.PanelControlPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'calendario-citas',
    loadChildren: () => import('./pages/calendario-citas/calendario-citas.module').then(m => m.CalendarioCitasPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'perfil-paciente',
    loadChildren: () => import('./pages/perfil-paciente/perfil-paciente.module').then(m => m.PerfilPacientePageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'consultas-pasadas',
    loadChildren: () => import('./pages/consultas-pasadas/consultas-pasadas.module').then(m => m.ConsultasPasadasPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'consultorios-cercanos',
    loadChildren: () => import('./pages/consultorios-cercanos/consultorios-cercanos.module').then( m => m.ConsultoriosCercanosPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'grabar-consulta',
    loadChildren: () => import('./pages/grabar-consulta/grabar-consulta.module').then( m => m.GrabarConsultaPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'chat-de-pacientes',
    loadChildren: () => import('./pages/chat-de-pacientes/chat-de-pacientes.module').then( m => m.ChatDePacientesPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'chat-room/:chatId', // Ruta dinámica para el ID del chat
    loadChildren: () =>
      import('./pages/chat-room/chat-room.module').then(
        (m) => m.ChatRoomPageModule
      ),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
