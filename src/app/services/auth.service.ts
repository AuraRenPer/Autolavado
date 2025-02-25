import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDocs, getDoc, collection, query, where, Timestamp, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { encryptData, decryptData } from '../utils/encryption';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private jwtHelper = inject(JwtHelperService);

  /**
   * Registro de usuario
   */
  async registerUser(email: string, username: string, password: string) {
    try {
      // Verificar si hay usuarios en Firestore
      const usersRef = collection(this.firestore, 'users');
      const usersSnapshot = await getDocs(usersRef);
      let role = 'user'; // Por defecto

      if (usersSnapshot.empty) {
        role = 'admin'; // Primer usuario será "admin"
      }

      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Obtener permisos del rol
      const rolesRef = collection(this.firestore, 'roles');
      const q = query(rolesRef, where('role', '==', role));
      const querySnapshot = await getDocs(q);
      let permissions: string[] = [];

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        permissions = data['permissions'] ?? [];
      }

      // Cifrar la contraseña y el rol
      const encryptedPassword = await encryptData(password);
      const encryptedRole = await encryptData(role);

      // Guardar usuario en Firestore
      await setDoc(doc(this.firestore, 'users', uid), {
        email,
        username,
        password: encryptedPassword,
        role: encryptedRole,
        permissions,
        last_login: new Date()
      });

      return { success: true };
    } catch (error: unknown) {
      console.error('Error en registro:', error);
      let errorMessage = 'Ocurrió un error desconocido';

      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión.';
        } else if (error.message.includes('auth/weak-password')) {
          errorMessage = 'La contraseña es demasiado débil.';
        } else if (error.message.includes('auth/invalid-email')) {
          errorMessage = 'El formato del correo no es válido.';
        } else {
          errorMessage = error.message;
        }
      }

      return { success: false, message: errorMessage };
    }
  }

  /**
   * Inicio de sesión
   */
  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      const userDocRef = doc(this.firestore, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDocSnap.data();
      const newLoginTimestamp = Timestamp.now();
      await updateDoc(userDocRef, { last_login: newLoginTimestamp });

      // Desencriptar rol y permisos
      const decryptedRole = await decryptData(userData['role']);
      const permissions = userData['permissions'] || [];

      // Construcción del token JWT
      const tokenPayload = {
        uid,
        email,
        username: userData['username'],
        last_login: newLoginTimestamp.toDate().toLocaleString(),
        role: decryptedRole,
        permissions,
        exp: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
      };

      console.log("Token Antes de Encriptar:", tokenPayload);

      const token = btoa(JSON.stringify(tokenPayload));
      localStorage.setItem('authToken', token);

      console.log("Token Encriptado:", token);

      return { success: true, token };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: (error as any).message };
    }
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('authToken');
      console.log('Usuario cerró sesión.');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtener el usuario actual desde el token JWT
   */
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    console.log("Token Encriptado Recuperado:", token);

    try {
      const decodedToken = JSON.parse(atob(token));
      console.log("Token Desencriptado:", decodedToken);
      return decodedToken;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  /**
   * Validar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  /**
   * Obtener token JWT del usuario autenticado
   */
  getToken() {
    return localStorage.getItem('authToken');
  }
}
