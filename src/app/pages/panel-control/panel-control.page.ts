import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { AuthService } from '../../services/auth.service'; // Importar el servicio de autenticación
import { Router } from '@angular/router';

interface Window {
  YT: any;
  onYouTubeIframeAPIReady: () => void;
}

declare var window: Window;

@Component({
  selector: 'app-panel-control',
  templateUrl: './panel-control.page.html',
  styleUrls: ['./panel-control.page.scss'],
})
export class PanelControlPage implements OnInit {
  serviciosProximas: {
    id: string;
    fechaCita: Date;
    horaCita: string;
    nombreServicio: string;
    nombreAutolavado: string;
    estatus: string;
    imagenUrl?: string;
  }[] = [];


  obtenerCitasPorUsuario: Array<{ idUsuario: string }> = [];
  usuario: any;
  isProveedor = false;
  isCliente = false;

  constructor(
    private serviciosService: ServiciosService,
    private authService: AuthService, // Inyectar el servicio de autenticación
    private router: Router // Inyectar el router para redirigir
  ) { }

    // Función para navegar a Historial de Servicios
    goToHistorialServicios() {
      this.router.navigate(['/historialservicios']);
    }
  
    // Función para navegar a Contratar Servicio
    goToContratarservicio() {
      this.router.navigate(['/autolavados-cercanos']); // Navegar a la página contratarservicio
    }
  
    goToGestionarCita() {
      this.router.navigate(['/calendario-citas']);
    }
  
    goToHistorialServiciosProveedor() {
      this.router.navigate(['/historial-proveedor']);
    }
  
    goToSolicitudesProveedor() {
      this.router.navigate(['/solicitudes-proveedor']);
    }
    goToServiciosProveedor() {
      this.router.navigate(['/gestionar-servicios']);
    }
  

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    console.log('👤 Usuario detectado:', usuario);

    this.isProveedor = usuario?.rol === 'proveedor';
    this.isCliente = usuario?.rol === 'cliente';
    console.log('usuario:', usuario);
  }


  async cargarCitasProximas() {
    console.log("ID USUARIO", this.usuario?.id);
    if (!this.usuario || !this.usuario.id) {
      console.warn("⚠ No se puede cargar citas porque el usuario no está disponible.");
      return;
    }

    const citas = await this.serviciosService.obtenerCitasPorUsuario(this.usuario.id).toPromise();
    const ahora = new Date();

    console.log("CITAS DE USUARIO", citas);

    if (!citas || citas.length === 0) {
      this.serviciosProximas = [];
      return;
    }

    const proveedores = await this.serviciosService.obtenerTodosLosProveedores().toPromise();

    const citasEnriquecidas = await Promise.all(
      citas.map(async (cita) => {
        const citaEnriquecida: any = {
          id: cita.id,
          fechaCita: new Date(cita.fechaCita),
          horaCita: cita.horaCita,
          estatus: cita.estado || "Sin estado"
        };

        // 🔍 Buscar el proveedor
        const proveedorEncontrado = (proveedores ?? []).find(p => p.id === cita.idProveedor);
        citaEnriquecida.nombreAutolavado = proveedorEncontrado?.nombreAutolavado || "Autolavado desconocido";

        // 🔍 Buscar servicio por proveedor
        try {
          const servicios = await this.serviciosService.obtenerServiciosPorProveedor(cita.idProveedor).toPromise();
          const servicioEncontrado = (servicios ?? []).find(s => s.id === cita.idServicio);
          citaEnriquecida.nombreServicio = servicioEncontrado?.nombre || "Servicio desconocido";
        } catch (error) {
          console.warn("❌ Error al obtener servicios del proveedor:", error);
          citaEnriquecida.nombreServicio = "Servicio no disponible";
        }

        return citaEnriquecida;
      })
    );
    console.log("cita enrequicida", citasEnriquecidas);

    // 🎯 Filtrar solo futuras
    this.serviciosProximas = citasEnriquecidas.filter(c => c.fechaCita > ahora);
    console.log("✅ Citas enriquecidas:", this.serviciosProximas);
  }


  async cerrarSesion() {
    try {
      console.log('cerrarSesion: Intentando cerrar sesión.');

      // Reiniciar la API de YouTube
      if (window.YT) {
        console.log('cerrarSesion: Eliminando instancia de la API de YouTube.');
        window.YT = undefined; // Reinicia la referencia a la API
        window.onYouTubeIframeAPIReady = () => { }; // Limpia el callback asignando una función vacía
      }

      // Lógica de cierre de sesión
      await this.authService.logout();
      alert('Sesión cerrada exitosamente.');
      this.router.navigate(['/login']); // Redirigir al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al cerrar la sesión. Por favor, inténtalo de nuevo.');
    }
  }

}

interface ServicioEnProveedor {
  id: string;
  nombre: string;
  imagen?: string;
}

interface ProveedorConServicios {
  id: string;
  nombreAutolavado: string;
  servicios: ServicioEnProveedor[];
}

let mapaServiciosPorProveedor: ProveedorConServicios[] = [];
