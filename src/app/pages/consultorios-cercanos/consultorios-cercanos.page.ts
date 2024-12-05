import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-consultorios-cercanos',
  templateUrl: './consultorios-cercanos.page.html',
  styleUrls: ['./consultorios-cercanos.page.scss'],
})
export class ConsultoriosCercanosPage implements AfterViewInit {
  map: google.maps.Map | undefined;
  markers: google.maps.marker.AdvancedMarkerElement[] = []; // Almacena los marcadores

  constructor() {}

  async ngAfterViewInit() {
    // Cargar el mapa automáticamente al cargar la página
    await this.loadMap();
  }

  async loadMap() {
    try {
      // Obtener la ubicación del usuario
      const position = await this.getUserLocation();

      // Crear el mapa centrado en la ubicación del usuario
      const mapOptions: google.maps.MapOptions = {
        center: { lat: position.lat, lng: position.lng },
        zoom: 15,
        mapId: '4d94bdd0d19eaa6f', // Reemplaza con tu Map ID
      };

      const mapElement = document.getElementById('map') as HTMLElement;
      const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      this.map = new Map(mapElement, mapOptions);

      // Agregar un marcador avanzado en la ubicación del usuario
      new AdvancedMarkerElement({
        map: this.map,
        position: { lat: position.lat, lng: position.lng },
        title: 'Tu ubicación',
      });

      // Buscar lugares relacionados con la salud cerca de la ubicación del usuario
      this.searchNearbyHealthLocations(position);
    } catch (error) {
      console.error('Error al cargar el mapa:', error);
    }
  }

  private async searchNearbyHealthLocations(position: { lat: number; lng: number }) {
    if (!this.map) {
      console.error('El mapa no está inicializado.');
      return;
    }

    const service = new google.maps.places.PlacesService(this.map);
    const request: google.maps.places.TextSearchRequest = {
      location: position,
      radius: 5000, // Radio de búsqueda en metros
      query: 'salud', // Busca lugares relacionados con la salud
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        this.addMarkers(results);
      } else {
        console.error('No se encontraron lugares:', status);
      }
    });
  }

  private addMarkers(places: google.maps.places.PlaceResult[]) {
    if (!this.map) {
      console.error('El mapa no está inicializado.');
      return;
    }

    this.clearMarkers(); // Eliminar marcadores anteriores

    const { AdvancedMarkerElement } = google.maps.marker;
    places.forEach((place) => {
      if (place.geometry && place.geometry.location) {
        const marker = new AdvancedMarkerElement({
          map: this.map,
          position: place.geometry.location.toJSON(),
          title: place.name || 'Lugar sin nombre',
        });

        this.markers.push(marker);
      }
    });
  }

  private clearMarkers() {
    this.markers.forEach((marker) => marker.map = null);
    this.markers = [];
  }

  // Obtener la ubicación del usuario
  private getUserLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            reject('No se pudo obtener la ubicación del usuario.');
          }
        );
      } else {
        reject('La geolocalización no está soportada por el navegador.');
      }
    });
  }
}
