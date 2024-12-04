import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { AuthService } from '../../services/auth.service'; // Importar el servicio de autenticación
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-control',
  templateUrl: './panel-control.page.html',
  styleUrls: ['./panel-control.page.scss'],
})
export class PanelControlPage implements OnInit {
  citasProximas: Array<{ id: string; fechaHora: Date; imagenUrl?: string }> = [];

  constructor(
    private citasService: CitasService,
    private authService: AuthService, // Inyectar el servicio de autenticación
    private router: Router // Inyectar el router para redirigir
  ) {}

  ngOnInit() {
    this.cargarCitasProximas();
  }

  cargarCitasProximas() {
    const ahora = new Date();

    // Suscribirse al observable de citas para actualizaciones en tiempo real
    this.citasService.citas$.subscribe((citas) => {
      this.citasProximas = citas
        .map((cita) => ({
          ...cita,
          fechaHora: new Date(cita.fechaHora),
        }))
        .filter((cita) => cita.fechaHora > ahora); // Filtrar solo las citas futuras
      console.log('Citas próximas actualizadas:', this.citasProximas);
    });
  }

  async cerrarSesion() {
    try {
      await this.authService.logout(); // Llamar al método de logout
      alert('Sesión cerrada exitosamente.');
      this.router.navigate(['/login']); // Redirigir al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al cerrar la sesión. Por favor, inténtalo de nuevo.');
    }
  }
}
