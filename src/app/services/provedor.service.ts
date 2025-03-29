import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private apiUrl = 'https://api-cog73kiucq-uc.a.run.app/api/proveedores';

  constructor(private http: HttpClient) {}

  crearProveedor(proveedorData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/crearproveedor`, proveedorData, { headers });
  }
}
