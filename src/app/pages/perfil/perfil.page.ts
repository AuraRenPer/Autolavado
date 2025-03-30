import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  user: any;
  esProveedor = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient,
  ) {
    this.loadUserData();
  }

  async loadUserData() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const storedUser = localStorage.getItem("usuario");
    this.user = storedUser ? JSON.parse(storedUser) : null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const apiUrl = `https://api-cog73kiucq-uc.a.run.app/api/usuarios/${userId}`;
      
      const userProfile: any = await this.http.get(apiUrl, { headers }).toPromise();
      
      if (userProfile) {
        this.user = userProfile;
        localStorage.setItem("usuario", JSON.stringify(userProfile));
        this.esProveedor = userProfile.rol === 'proveedor';
      }
    } catch (error) {
      console.warn("⚠️ No se pudo obtener datos desde la API. Usando datos locales.");
    }
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  regresar() {
    this.router.navigate(['/panel-control']);
  }

  irAHomeProveedor() {
    this.router.navigate(['/panel-control']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Quieres realmente cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Salir',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  irAEditarPerfil() {
    if (!this.user) {
      console.warn("⛔ No se puede editar porque el usuario aún no está cargado.");
      return;
    }
    this.router.navigate(['/edit-profile']);
  }

  irARegistroProveedor() {
    this.router.navigate(['/registro-proveedor']);
  }
}
