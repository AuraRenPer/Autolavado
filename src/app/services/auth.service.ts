import { Injectable } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private currentUser: User | null = null;

  constructor() {
    this.monitorAuthState();
  }

  // Monitorear el estado del usuario
  private monitorAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      console.log('Estado de autenticación cambiado:', user);
    });
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Registro de usuario
  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario registrado:', userCredential.user);
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Inicio de sesión
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario inició sesión:', userCredential.user);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Usuario cerró sesión.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
}
