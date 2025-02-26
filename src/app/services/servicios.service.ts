import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private baseUrl = 'https://us-central1-autolavado-38624.cloudfunctions.net'; // ✅ Base URL de Cloud Functions

  constructor(private http: HttpClient) {}

  /** ✅ Agregar un servicio (POST) */
  agregarServicio(servicio: {
    cliente: string;
    vehiculo: string;
    tipoServicio: string;
    fechaHora: string;
    estado: string;
  }) {
    return this.http.post(`${this.baseUrl}/crearServicio`, servicio).subscribe({
      next: (response) => console.log('✅ Servicio agregado con éxito:', response),
      error: (error) => console.error('❌ Error al agregar servicio:', error),
    });
  }

  /** ✅ Obtener todos los servicios (GET) */
  obtenerServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/obtenerServicios`);
  }

  /** ✅ Actualizar un servicio (PUT) */
  actualizarServicio(
    id: string,
    nuevoServicio: {
      cliente: string;
      vehiculo: string;
      tipoServicio: string;
      fechaHora: string;
      estado: string;
    }
  ) {
    return this.http.put(`${this.baseUrl}/actualizarServicio/${id}`, nuevoServicio).subscribe({
      next: (response) => console.log('✅ Servicio actualizado con éxito:', response),
      error: (error) => console.error('❌ Error al actualizar servicio:', error),
    });
  }

  /** ✅ Eliminar un servicio (DELETE) */
  eliminarServicio(id: string) {
    return this.http.delete(`${this.baseUrl}/eliminarServicio/${id}`).subscribe({
      next: (response) => console.log('✅ Servicio eliminado con éxito:', response),
      error: (error) => console.error('❌ Error al eliminar servicio:', error),
    });
  }
}
