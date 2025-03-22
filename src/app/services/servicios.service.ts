import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private baseUrl = 'https://api-cog73kiucq-uc.a.run.app/api'; // ✅ Base URL de Cloud Functions

  constructor(private http: HttpClient) {}

  /** ✅ Agregar un servicio (POST) */
  async agregarServicio(servicio: {
    cliente: string;
    vehiculo: string;
    tipoServicio: string;
    fechaHora: string;
    estado: string;
  }) {
    try {
      const response = await this.http.post(`${this.baseUrl}/servicios/crearservicio`, servicio).toPromise();
      console.log("✅ Servicio enviado al backend correctamente:", response);
    } catch (error) {
      console.error("❌ Error al enviar servicio al backend:", error);
    }
  }
  
  /** ✅ Obtener todos los servicios (GET) */
  obtenerServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/servicios/obtenerservicios`);
  }

  /** ✅ Obtener servicios por ID de proveedor */
  obtenerServiciosPorProveedor(idProveedor: string): Observable<any[]> {
    if (!idProveedor) {
      console.error("❌ ID de proveedor no válido en el servicio");
      return of([]); // Devuelve observable vacío para evitar error 500
    }
  
    const url = `${this.baseUrl}/servicios/obtenerserviciosproveedor/${idProveedor}`;
    return this.http.get<any[]>(url);
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
    return this.http.put(`${this.baseUrl}/servicios/actualizarServicio/${id}`, nuevoServicio).subscribe({
      next: (response) => console.log('✅ Servicio actualizado con éxito:', response),
      error: (error) => console.error('❌ Error al actualizar servicio:', error),
    });
  }

  /** ✅ Eliminar un servicio (DELETE) */
  eliminarServicio(id: string) {
    return this.http.delete(`${this.baseUrl}/servicios/eliminarServicio/${id}`).subscribe({
      next: (response) => console.log('✅ Servicio eliminado con éxito:', response),
      error: (error) => console.error('❌ Error al eliminar servicio:', error),
    });
  }

  guardarVehiculo(vehiculoData: any): Promise<any> {
    const url = `${this.baseUrl}/vehiculos/crearvehiculo`;
    return this.http.post<any>(url, vehiculoData).toPromise();
  }
  
  agendarCita(citaData: any): Promise<any> {
    const url = `${this.baseUrl}/citas/crearcita`;
    return this.http.post<any>(url, citaData).toPromise();
  }
  
  
}
