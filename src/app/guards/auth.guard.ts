import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * 🔹 Función para decodificar un token JWT en Base64URL
   */
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]; // Extraemos el PAYLOAD del JWT
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 🔹 Convertir Base64URL a Base64 estándar
      return JSON.parse(atob(base64)); // Decodificar y parsear JSON
    } catch (error) {
      console.error('🚨 Error al decodificar el token:', error);
      return null;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();

    if (!token) {
      console.warn("🔴 No hay token. Redirigiendo a login.");
      this.router.navigate(['/login']);
      return false;
    }

    // 🔹 Usamos `decodeJWT()` en lugar de `atob()`
    const tokenPayload = this.decodeJWT(token);
    if (!tokenPayload) {
      console.warn("🔴 Token inválido. Redirigiendo a login.");
      this.router.navigate(['/login']);
      return false;
    }

    console.log("✅ Token decodificado correctamente:", tokenPayload);

    // 🔹 Verificar permisos según el rol
    const requiredRoles = route.data['roles'];
    if (requiredRoles && !requiredRoles.includes(tokenPayload.rol)) { // 🔹 Cambiado de `role` a `rol`
      console.warn(`🔴 Usuario sin permisos (${tokenPayload.rol}). Redirigiendo a home.`);
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
