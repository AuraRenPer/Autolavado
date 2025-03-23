import { Injectable, inject } from '@angular/core';
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

  async registerUser(nombre: string, apellido: string, correo: string, password: string, username: string, telefono: string) {
  try {
    const fechaLogin = new Date().toISOString(); // 🔹 Se agrega `fechaLogin`
    const rol = "cliente"; // 🔹 Se asigna un rol por defecto (puedes cambiarlo si es necesario)
    const estatus = "activo"; // 🔹 Se asigna un estatus por defecto

    const response = await this.http.post<{ success?: boolean; error?: string }>(
      `${this.apiUrl}/usuarios_servilink`,
      { nombre, apellido, correo, password, username, telefono, fechaLogin, rol, estatus }
    ).toPromise();

    if (response?.error) {
      return { success: false, message: response.error };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en registro:', error);
    return { success: false, message: error.message || "Ocurrió un error inesperado" };
  }
}

async loginUser(credentials: { login: string, password: string }) {
  try {
    const response = await this.http.post<{ token: string, usuario: any }>(
      `${this.apiUrl}/usuarios_servilink/login`,
      credentials
    ).toPromise();

    if (response?.token) {
      console.log("✅ Token recibido:", response.token);

      // 🔹 Guardar el token correctamente en localStorage
      this.saveToken(response.token); //-----llega aqui

      // 🔹 Guardar información adicional del usuario
      localStorage.setItem("userRole", response.usuario.rol);
      localStorage.setItem("userPermissions", JSON.stringify(response.usuario.permisos || []));
      localStorage.setItem("usuario", JSON.stringify(response.usuario));
      console.log("SI ES O NOOOOO USUARIOOOOOOOOOOO", JSON.stringify(response.usuario));
      return { success: true };
    } else {
      console.error("❌ No se recibió un token en la respuesta.");
      return { success: false, message: "Credenciales incorrectas" };
    }
  } catch (error: any) {
    console.error("❌ Error en login:", error);
    return { success: false, message: error.message || "Ocurrió un error inesperado" };
  }
}

/**
 * Guardar el token en localStorage
 */
saveToken(token: string): void {
  localStorage.setItem("token", token);
  console.log("✅ Token guardado en localStorage:", localStorage.getItem("token"));
}

/**
 * Obtener el token desde localStorage
 */
getToken(): string | null {
  const token = localStorage.getItem("token");
  console.log("🔍 Token obtenido en AuthService:", token);
  return token;
}

/**
 * Cerrar sesión
 */
logout() {
  console.log("🚨 Cerrando sesión y eliminando token...");
  localStorage.removeItem("token"); // 🔹 Ahora se elimina correctamente la clave "token"
  localStorage.removeItem("userRole");
  localStorage.removeItem("userPermissions");
  this.router.navigate(['/login']);
}

/**
 * Verificar si el usuario está autenticado
 */
isAuthenticated(): boolean {
  const token = this.getToken();
  return token !== null;
}

/**
 * Obtener permisos del usuario
 */
getUserPermissions(): string[] {
  const permissions = localStorage.getItem("userPermissions");
  return permissions ? JSON.parse(permissions) : [];
}

/**
 * Verificar si el usuario tiene un permiso específico
 */
hasPermission(permission: string): boolean {
  return this.getUserPermissions().includes(permission);
}

/**
 * Obtener el rol del usuario
 */
getUserRole(): string {
  return localStorage.getItem("userRole") || 'user';
}

getUsuario(): any {
  const userData = localStorage.getItem('usuario');
  console.log("🧠 getUsuario():", userData);
  return userData ? JSON.parse(userData) : null;
}


}

/**
* Función para decodificar el token JWT
*/
function decodeJWT(token: string): any {
try {
  const base64Url = token.split('.')[1]; // Extraemos el PAYLOAD del JWT
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 🔹 Convertir Base64URL a Base64 estándar
  return JSON.parse(atob(base64)); // Decodificar y parsear JSON
} catch (error) {
  console.error('❌ Error al decodificar el token:', error);
  return null;
}
}

