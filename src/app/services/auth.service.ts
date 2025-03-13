import { Injectable, inject } from '@angular/core';
import { signOut } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`; // URL dinámica de backend

  constructor() { }

  async registerUser(nombre: string, apellido: string, correo: string, password: string, telefono: string) {
    try {
      const fechaRegistro = new Date().toISOString(); // 🔹 Se agrega `fechaRegistro`
      const rol = "cliente"; // 🔹 Se asigna un rol por defecto (puedes cambiarlo si es necesario)
      const estatus = "activo"; // 🔹 Se asigna un estatus por defecto

      const response = await this.http.post<{ success?: boolean; mensaje?: string; error?: string }>(
          `${this.apiUrl}/usuarios_servilink`,
          { nombre, apellido, correo, password, telefono, fechaRegistro, rol, estatus }
      ).toPromise();

      if (response && response.error) {
          return { success: false, message: response.error };
      }

      return { success: true };
  } catch (error: any) {
      console.error('Error en registro:', error);
      return { success: false, message: error.message || 'Ocurrió un error inesperado' };
  }
}

 
async loginUser(correo: string, password: string) {
  try {
      const response = await this.http.post<{ mensaje?: string; error?: string; token?: string }>(
          `${this.apiUrl}/usuarios/login`,
          { correo, password }
      ).toPromise();

      if (response && response.error) {
          return { success: false, message: response.error };
      }

      if (response?.token) {
          localStorage.setItem('authToken', response.token);

          const decodedToken = decodeJWT(response.token);
          if (decodedToken) {
              localStorage.setItem('userRole', decodedToken.rol);
              localStorage.setItem('userPermissions', JSON.stringify(decodedToken.permisos));
          }

          return { success: true, token: response.token };
      }

      return { success: false, message: 'Error en el login' };
  } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, message: error.message || 'Ocurrió un error inesperado' };
  }
}

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPermissions');
    this.router.navigate(['/login']);
  }


  getToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }


    getUserPermissions(): string[] {
      const permissions = localStorage.getItem('userPermissions');
      return permissions ? JSON.parse(permissions) : [];
  }

  hasPermission(permission: string): boolean {
      return this.getUserPermissions().includes(permission);
  }

  getUserRole(): string {
      return localStorage.getItem('userRole') || 'user';
  }

    // Obtener el usuario actual
    getCurrentUser(): { uid?: string; nombre?: string; apellido?: string; correo?: string; rol?: string; permisos?: string[] } | null {
      const token = this.getToken();
      if (!token) return null; // 🔹 Si no hay token, retorna null
  
      const decodedToken = decodeJWT(token); // 🔹 Decodifica el JWT
  
      if (!decodedToken) return null; // 🔹 Si la decodificación falla, retorna null
  
      return {
          uid: decodedToken.uid || null,
          nombre: decodedToken.nombre || null,
          apellido: decodedToken.apellido || null,
          correo: decodedToken.correo || null,
          rol: decodedToken.rol || 'user',
          permisos: decodedToken.permisos || []
      };
  }
  
}

function decodeJWT(token: string): any {
  try {
      const base64Url = token.split('.')[1]; // Extraemos el PAYLOAD del JWT
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 🔹 Convertir Base64URL a Base64 estándar
      return JSON.parse(atob(base64)); // Decodificar y parsear JSON
  } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
  }
}
