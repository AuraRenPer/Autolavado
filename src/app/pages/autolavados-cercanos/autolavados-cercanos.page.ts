import { Component, AfterViewInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-autolavados-cercanos',
  templateUrl: './autolavados-cercanos.page.html',
  styleUrls: ['./autolavados-cercanos.page.scss'],
  standalone: false,
})
export class AutolavadosCercanosPage implements AfterViewInit {
  map: google.maps.Map | undefined;
  markers: google.maps.marker.AdvancedMarkerElement[] = [];
  proveedores: any[] = [];
  serviciosPorProveedor: { [key: string]: any[] } = {};
  cargandoServicios: { [idProveedor: string]: boolean } = {};
  cargandoProveedores: boolean = false;
  accordionAbierto: { [id: string]: boolean } = {};

  constructor(private http: HttpClient, private navCtrl: NavController, private ngZone: NgZone, private serviciosService: ServiciosService, private router: Router) { }

  async ngAfterViewInit() {
    await this.loadMap();
    await this.cargarProveedores();
  }

  async loadMap() {
    try {
      const position = await this.getUserLocation();
      const mapOptions: google.maps.MapOptions = {
        center: { lat: position.lat, lng: position.lng },
        zoom: 13,
        mapId: '4d94bdd0d19eaa6f', // tu Map ID
      };

      const mapElement = document.getElementById('map') as HTMLElement;
      const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      this.map = new Map(mapElement, mapOptions);

      new AdvancedMarkerElement({
        map: this.map,
        position: { lat: position.lat, lng: position.lng },
        title: 'Tu ubicación',
      });
    } catch (error) {
      console.error('Error al cargar el mapa:', error);
    }
  }

  async cargarProveedores() {
    this.cargandoProveedores = true;
  
    try {
      const response: any = await this.http.get(
        'https://api-cog73kiucq-uc.a.run.app/api/proveedores/soloConServicios'
      ).toPromise();
  
      const imagenes = [
        'assets/carpinteria.jpg',
        'assets/electricidad.jpg',
        'assets/mecanica.jpg',
        'assets/plomeria.jpg',
      ];
  
      // ⏳ Simular tiempo de carga
      setTimeout(() => {
        this.proveedores = response.map((proveedor: any) => {
          proveedor.imagenUrl = imagenes[Math.floor(Math.random() * imagenes.length)];
          this.serviciosPorProveedor[proveedor.id] = (proveedor.serviciosDisponibles || []).map((servicio: any) => ({
            id: servicio.id || servicio.idServicio || `${proveedor.id}-${Math.random().toString(36).substring(2)}`,
            nombre: servicio.nombre || 'Nombre no disponible',
            descripcion: servicio.descripcionProblema || 'Sin descripción',
            precio: `$${servicio.precio || 'N/A'}`,
            duracion: servicio.duracion || 'N/A'
          }));
          
  
          return proveedor;
        });
  
        // ✅ 1. Inicializar el mapa solo una vez
        this.loadMap();
  
        // ✅ 2. Agregar marcadores ya que el mapa está listo
        this.proveedores.forEach((proveedor) => {
          this.agregarMarcador(proveedor);
        });
  
        this.cargandoProveedores = false;
      }, 2000);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      this.cargandoProveedores = false;
    }
  }
  
  agregarMarcador(proveedor: any) {
    if (!this.map || !proveedor.ubicacion) return;

    const { AdvancedMarkerElement } = google.maps.marker;

    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: {
        lat: proveedor.ubicacion.lat,
        lng: proveedor.ubicacion.lng,
      },
      title: proveedor.nombreEmpresa,
    });

    this.markers.push(marker);
  }

  mostrarServicios(proveedor: any) {
    const id = proveedor.id;
    if (!id) return;

    // Evitar volver a cargar si ya se cargó
    if (this.serviciosPorProveedor[id]) return;

    this.cargandoServicios[id] = true;

    this.serviciosService.obtenerServiciosPorProveedor(id).subscribe({
      next: (servicios) => {
        setTimeout(() => {
          if (servicios.length > 0) {
            this.serviciosPorProveedor[id] = servicios;
          } else {
            // Puedes ocultar el proveedor si no quieres mostrarlo
            this.proveedores = this.proveedores.filter(p => p.id !== id);
          }
          this.cargandoServicios[id] = false;
        }, 2000);
      },
      error: (err) => {
        console.error("❌ Error al obtener servicios:", err);
        // Marcar como lista vacía explícitamente
        this.serviciosPorProveedor[id] = [];
        this.cargandoServicios[id] = false;
      },
    });
  }



  esValidoServicio(proveedorId: string): boolean {
    return (
      !!proveedorId &&
      Array.isArray(this.serviciosPorProveedor[proveedorId]) &&
      this.serviciosPorProveedor[proveedorId].length > 0
    );
  }

  solicitarServicio(proveedor: any, servicio: any) {
    // Datos completos para visualización
    const datos = {
      idProveedor: proveedor.id,
      idServicio: servicio.id,
      nombreProveedor: proveedor.nombreEmpresa,
      nombreServicio: servicio.nombre,
      precioServicio: servicio.precio,
      duracionServicio: servicio.duracion
    };

    localStorage.setItem('seleccionAutolavado', JSON.stringify(datos));

    this.navCtrl.navigateForward(['/gestion-citas'], {
      state: {
        proveedor,
        servicio
      }
    });
  }


  seleccionarProveedorYServicio(proveedor: any, servicio: any) {
    const seleccion = {
      idProveedor: proveedor.id,  // Guardamos el ID del proveedor
      nombreProveedor: proveedor.nombreEmpresa, // Guardamos el nombre
      idServicio: servicio.id,  // Guardamos el ID del servicio
      nombreServicio: servicio.nombre, // Guardamos el nombre del servicio
      precioServicio: servicio.precio, // Precio del servicio
      duracionServicio: servicio.duracion, // Duración estimada
    };

    localStorage.setItem('seleccionAutolavado', JSON.stringify(seleccion));
    const proveedorSeleccionado = proveedor;
    const servicioSeleccionado = servicio;
    // Navegar a la pantalla de citas
    this.navCtrl.navigateForward(['/calendario-citas'], {
      state: {
        proveedor: proveedorSeleccionado,
        servicio: servicioSeleccionado
      }
    });
  }


  private getUserLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
          () => reject('No se pudo obtener la ubicación del usuario.')
        );
      } else {
        reject('La geolocalización no está soportada por el navegador.');
      }
    });
  }

  generarPrecioAleatorio(): string {
    const precios = [150, 200, 250, 300, 350];
    return `$${precios[Math.floor(Math.random() * precios.length)]}`;
  }

  generarDuracionAleatoria(): string {
    const duraciones = ['30 min', '45 min', '1 hora', '1.5 horas'];
    return duraciones[Math.floor(Math.random() * duraciones.length)];
  }


}
