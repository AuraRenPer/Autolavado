import { Component, AfterViewInit, NgZone  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

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

  constructor(private http: HttpClient, private navCtrl: NavController, private ngZone: NgZone) { }

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

  async mostrarServicios(proveedor: any) {
    try {
      const id = proveedor.id || proveedor.idProveedor;

      if (this.serviciosPorProveedor[id]) {
        console.log("✅ Servicios ya cargados para el proveedor:", id);
        return;
      }

      console.log("🔍 Solicitando servicios para el proveedor:", id);

      const url = `https://api-cog73kiucq-uc.a.run.app/api/servicios/obtenerserviciosproveedor/${id}`;
      console.log("🌐 URL de la solicitud:", url);

      const servicios = await this.http.get<any[]>(url).toPromise();

      console.log("📥 Respuesta de la API:", servicios);

      // Usamos NgZone para actualizar la UI de Angular
      this.ngZone.run(() => {
        this.serviciosPorProveedor[id] = servicios || [];
      });

    } catch (error) {
      console.error("❌ Error al obtener servicios del proveedor:", error);
    }
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

    // Navegar a la pantalla de citas
    this.navCtrl.navigateForward('/calendario-servicios');
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
