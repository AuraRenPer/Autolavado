import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { AuthService } from '../../services/auth.service'; // Importar el servicio de autenticación
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; // Importar el archivo de entorno

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


  constructor(
    private serviciosService: ServiciosService,
    private authService: AuthService, // Inyectar el servicio de autenticación
    private router: Router // Inyectar el router para redirigir
  ) { }

  ngOnInit() {
    console.log('ngOnInit: Inicializando la página PanelControl');
    this.usuario = this.authService.getUsuario(); // ← Agrega esto
    console.log("👤 Usuario cargado:", this.usuario);

    this.cargarCitasProximas();
    this.cargarYouTubeAPI();
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

  cargarYouTubeAPI() {
    console.log('cargarYouTubeAPI: Verificando si la API de YouTube ya está cargada.');

    if (!window.YT) {
      console.log('cargarYouTubeAPI: API de YouTube no encontrada, cargando script.');
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];

      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        console.log('cargarYouTubeAPI: Script de API de YouTube insertado correctamente.');
      } else {
        console.error('cargarYouTubeAPI: No se pudo encontrar un elemento <script> en el DOM.');
      }
    } else {
      console.log('cargarYouTubeAPI: API de YouTube ya cargada.');
    }

    // Esperar a que la API se cargue antes de inicializar el reproductor
    window.onYouTubeIframeAPIReady = () => {
      console.log('cargarYouTubeAPI: La API de YouTube está lista.');
      this.inicializarReproductor();
    };
  }

  inicializarReproductor() {
    console.log('inicializarReproductor: Inicializando el reproductor de YouTube.');

    // Destruir un reproductor existente si ya está presente
    const existingPlayer = document.getElementById('youtube-player');
    if (existingPlayer && window.YT && window.YT.Player) {
      console.log('inicializarReproductor: Eliminando reproductor existente.');
      existingPlayer.innerHTML = ''; // Limpia el contenedor del reproductor
    }

    try {
      new window.YT.Player('youtube-player', {
        height: '315',
        width: '560',
        videoId: 'pr6cpARvnKs',
        events: {
          onReady: this.onPlayerReady,
          onError: this.onPlayerError,
        },
      });
    } catch (error) {
      console.error('inicializarReproductor: Error al inicializar el reproductor.', error);
    }
  }

  onPlayerReady(event: any) {
    console.log('onPlayerReady: El reproductor de YouTube está listo.');
  }

  onPlayerError(event: any) {
    console.error('onPlayerError: Error en el reproductor de YouTube:', event);
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
