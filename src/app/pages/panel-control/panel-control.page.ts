import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { AuthService } from '../../services/auth.service'; // Importar el servicio de autenticación
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
    private router: Router, // Inyectar el router para redirigir
    private alertController: AlertController
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
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás segur@ de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('⛔ Cancelado por el usuario');
          }
        },
        {
          text: 'Sí, salir',
          role: 'confirm',
          handler: async () => {
            try {
              if (window.YT) {
                console.log('🧹 Reiniciando API de YouTube...');
                window.YT = undefined;
                window.onYouTubeIframeAPIReady = () => { };
              }
  
              await this.authService.logout();
              const confirmAlert = await this.alertController.create({
                header: 'Sesión cerrada',
                message: 'Esperamos verte pronto',
                buttons: ['OK']
              });
              await confirmAlert.present();
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo cerrar sesión. Intenta nuevamente.',
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });
  
    await alert.present();
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
