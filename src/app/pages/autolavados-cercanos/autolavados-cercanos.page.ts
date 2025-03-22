import { Component, AfterViewInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autolavados-cercanos',
  templateUrl: './autolavados-cercanos.page.html',
  styleUrls: ['./autolavados-cercanos.page.scss'],
})
export class AutolavadosCercanosPage implements AfterViewInit {
  map: google.maps.Map | undefined;
  markers: google.maps.marker.AdvancedMarkerElement[] = [];
  proveedores: any[] = [];
  serviciosPorProveedor: { [key: string]: any[] } = {};
  cargandoServicios: { [idProveedor: string]: boolean } = {};
  cargandoProveedores: boolean = false;

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
    console.log("Si llegan proveedores");
    this.cargandoProveedores = true; // 🔄 Inicio de carga

    try {
      const response: any = await this.http.get('https://api-cog73kiucq-uc.a.run.app/api/proveedores/obtenerproveedores').toPromise();
      this.proveedores = response;

      this.proveedores.forEach(proveedor => this.agregarMarcador(proveedor));
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
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
      title: proveedor.nombreAutolavado,
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
        // Agregamos retraso artificial
        setTimeout(() => {
          this.serviciosPorProveedor[id] = servicios;
          this.cargandoServicios[id] = false;
        }, 2000); // 2 segundos
      },
      error: (err) => {
        console.error("❌ Error al obtener servicios:", err);
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
      nombreProveedor: proveedor.nombreAutolavado,
      nombreServicio: servicio.nombre,
      precioServicio: servicio.precio,
      duracionServicio: servicio.duracion
    };
  
    localStorage.setItem('seleccionAutolavado', JSON.stringify(datos));
    console.log("🛠️ Selección de proveedor/servicio:", datos);
  
    // También navega con estado por si funciona
    this.navCtrl.navigateForward(['/calendario-citas'], {
      state: {
        proveedor,
        servicio
      }
    });
  }
  

  seleccionarProveedorYServicio(proveedor: any, servicio: any) {
    const seleccion = {
      idProveedor: proveedor.id,  // Guardamos el ID del proveedor
      nombreProveedor: proveedor.nombreAutolavado, // Guardamos el nombre
      idServicio: servicio.id,  // Guardamos el ID del servicio
      nombreServicio: servicio.nombre, // Guardamos el nombre del servicio
      precioServicio: servicio.precio, // Precio del servicio
      duracionServicio: servicio.duracion, // Duración estimada
    };

    localStorage.setItem('seleccionAutolavado', JSON.stringify(seleccion));
    console.log("Seleccion de autolavado y servicio", JSON.stringify(seleccion));
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
}
