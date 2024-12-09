import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
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
  citasProximas: Array<{ id: string; fechaHora: Date; imagenUrl?: string }> = [];
  private youtubeApiKey: string = environment.youtubeApiKey; // Asignar la clave de API desde el entorno

  constructor(
    private citasService: CitasService,
    private authService: AuthService, // Inyectar el servicio de autenticación
    private router: Router // Inyectar el router para redirigir
  ) {}

  ngOnInit() {
    console.log('ngOnInit: Inicializando la página PanelControl');
    this.cargarCitasProximas();
    this.cargarYouTubeAPI();
  }

  cargarCitasProximas() {
    const ahora = new Date();
    console.log('cargarCitasProximas: Obteniendo citas próximas.');

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
      console.log('cerrarSesion: Intentando cerrar sesión.');

      // Reiniciar la API de YouTube
      if (window.YT) {
        console.log('cerrarSesion: Eliminando instancia de la API de YouTube.');
        window.YT = undefined; // Reinicia la referencia a la API
        window.onYouTubeIframeAPIReady = () => {}; // Limpia el callback asignando una función vacía
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
        videoId: 'mO_95LQook4', 
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
