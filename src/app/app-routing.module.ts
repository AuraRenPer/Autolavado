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
    loadChildren: () => import('./pages/calendario-citas/calendario-servicios.module').then(m => m.CalendarioServiciosPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'perfil-paciente',
    loadChildren: () => import('./pages/perfil-paciente/perfil-paciente.module').then(m => m.PerfilPacientePageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/perfil-paciente.module').then(m => m.PerfilPacientePageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'consultas-pasadas',
    loadChildren: () => import('./pages/consultas-pasadas/consultas-pasadas.module').then(m => m.ServiciosPasadosPageModule),
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
    path: 'autolavados-cercanos',
    loadChildren: () => import('./pages/autolavados-cercanos/autolavados-cercanos.module').then( m => m.AutolavadosCercanosPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'grabar-consulta',
    loadChildren: () => import('./pages/grabar-servicio/grabar-servicio.module').then( m => m.GrabarServicioPageModule),
    canActivate: [AuthGuard], // Protegido por el guard
  },
  {
    path: 'chat-de-pacientes',
    loadChildren: () => import('./pages/chat-de-clientes/chat-de-clientes.module').then( m => m.ChatDeClientesPageModule),
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
