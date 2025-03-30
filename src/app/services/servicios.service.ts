import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private baseUrl = 'https://api-cog73kiucq-uc.a.run.app/api'; // ✅ Base URL de Cloud Functions

  constructor(private http: HttpClient) { }

  /** ✅ Agregar un servicio (POST) */
  async agregarServicio(servicio: {
    cliente: string;
    tipoServicio: string;
    fechaHora: string;
    estado: string;
  }) {
    try {
      const response = await this.http.post(`${this.baseUrl}/servicios/crearservicio`, servicio).toPromise();
    } catch (error) {
      console.error("❌ Error al enviar servicio al backend:", error);
    }
  }

  /** ✅ Obtener todos los servicios (GET) */
  obtenerServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/servicios/obtenerservicios`);
  }

  /** Obtener citas por id de usuario */
  obtenerCitasPorUsuario(idUsuario: string): Observable<any[]> {
    if (!idUsuario) {
      console.error("❌ ID de usuario no válido en el servicio");
      return of([]); // Devuelve observable vacío para evitar error 500
    }

    const url = `${this.baseUrl}/citas/obtenercitas/usuario/${idUsuario}`;
    return this.http.get<any[]>(url);
  }
  /** ✅ Obtener servicios por ID de proveedor */
  /** Se cambió este método ya que causaba conflicto en algo */
  obtenerServiciosPorProveedor(idProveedor: string): Observable<any[]> {
    if (!idProveedor) {
      console.error("❌ ID de proveedor no válido en el servicio");
      return of([]); // Devuelve observable vacío para evitar error 500
    }
  
    const url = `${this.baseUrl}/servicios/obtenerserviciosproveedor/${idProveedor}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        return of([]);
      })
    );
  }

  // Obtener todos los proveedores
  obtenerTodosLosProveedores(): Observable<any[]> {
    const url = `${this.baseUrl}/proveedores/obtenerproveedores`;
    return this.http.get<any[]>(url);
  }

  obtenerHistorialUsuario(idUsuario: string): Observable<any[]> {
    if (!idUsuario) {
      console.error("❌ ID de usuario no válido para obtener historial");
      return of([]); // Devuelve observable vacío para evitar error 500
    }
    const url = `${this.baseUrl}/historial/obtenerhistorial/${idUsuario}`;
    return this.http.get<any[]>(url);
  }




  /** ✅ Actualizar un servicio (PUT) */
  async actualizarServicio(
    id: string,
    nuevoServicio: {
      cliente: string;
      vehiculo: string;
      tipoServicio: string;
      fechaHora: string;
      estado: string;
    }
  ) {
    try {
      const response = await this.http.put(`${this.baseUrl}/servicios/actualizarservicio/${id}`, nuevoServicio).toPromise();
      console.log("Servicio actualizado con éxito:", response);
    } catch (error) {
      console.error("❌ Error al enviar servicio al backend:", error);
  }
}
  /** ✅ Eliminar un servicio (DELETE) */
  async eliminarServicio(id: string) {
    try {
      const response = await this.http.delete(`${this.baseUrl}/servicios/eliminarservicio/${id}`).toPromise();
      console.log("Servicio eliminado con éxito:", response);
    } catch (error) {
      console.error("✅ Error al eliminar:", error);
  }
  }


  agendarCita(citaData: any): Promise<any> {
    const url = `${this.baseUrl}/citas/crearcita`;
    return this.http.post<any>(url, citaData).toPromise();
  }

  crearHistorial(historial: any) {
    return this.http.post('https://api-cog73kiucq-uc.a.run.app/api/historial/crearhistorial', historial).toPromise();
  }

  obtenerCitasPorProveedor(idProveedor: string): Promise<any[]> {
    const url = `${this.baseUrl}/citas/obtenercitas/proveedor/${idProveedor}`;
    return this.http.get<any[]>(url).toPromise().then(res => res || []);
  }

  obtenerSolicitudesPorProveedor(idProveedor: string): Promise<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/solicitudes/obtenerporproveedor/${idProveedor}`).toPromise().then(res => res || []);
  }
  
  actualizarEstadoSolicitud(id: string, estado: string): Promise<any> {
    return this.http.patch(`${this.baseUrl}/solicitudes/actualizarsolicitud/${id}`, { estado }).toPromise();
  }
  
  crearSolicitud(data: any) {
    return this.http.post(`${this.baseUrl}/solicitudes/crearsolicitud`, data).toPromise().then(res => res || []);
  }
  
  obtenerProveedorPorUsuario(idUsuario: string): Promise<any> {
    return this.http.get<any>(`${this.baseUrl}/proveedores/obtenerPorUsuario/${idUsuario}`).toPromise();
  }

  obtenerSolicitudesPopuladasPorProveedor(idProveedor: string): Promise<any>{
    return this.http.get<any[]>(`${this.baseUrl}/solicitudes/obtenerpopuladaporproveedor/${idProveedor}`).toPromise().then(res => res || []);

  }
  
  guardarVehiculo(vehiculoData: any): Promise<any> {
    const url = `${this.baseUrl}/vehiculos/crearvehiculo`;
    return this.http.post<any>(url, vehiculoData).toPromise();
  }
  

}
