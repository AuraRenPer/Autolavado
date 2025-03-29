import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage {
  user: any;
  correoOriginal: string = '';
  usernameOriginal: string = '';
  nombreOriginal = '';
  apellidoOriginal = '';
  telefonoOriginal = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {
    this.loadUserData();

  }


  async loadUserData() {

    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const url = `https://api-cog73kiucq-uc.a.run.app/api/usuarios_servilink/${userId}`;

      const userProfile: any = await this.http.get(url, { headers }).toPromise();
      this.user = userProfile;
      this.correoOriginal = userProfile.correo;
      this.usernameOriginal = userProfile.username;
      this.nombreOriginal = userProfile.nombre;
      this.apellidoOriginal = userProfile.apellido;
      this.telefonoOriginal = userProfile.telefono;


      this.user = userProfile;
    } catch (error) {
      console.error("❌ Error al obtener datos de usuario:", error);
      this.router.navigate(['/login']);
    }

  }


  regresar() {
    this.router.navigate(['/profile']);
  }

  async editarPerfil() {
    const token = this.authService.getToken();

    const cambios =
      this.user.nombre !== this.nombreOriginal ||
      this.user.apellido !== this.apellidoOriginal ||
      this.user.correo !== this.correoOriginal ||
      this.user.username !== this.usernameOriginal ||
      this.user.telefono !== this.telefonoOriginal;

    if (!cambios) {
      const alert = await this.alertController.create({
        header: 'Sin cambios',
        message: 'No se detectaron cambios en tu perfil.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (!this.user.nombre || !this.user.apellido || !this.user.correo || !this.user.telefono) {
      console.warn("⚠️ Campos incompletos. Mostrando alerta.");
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.correo);

    if (!correoValido) {
      const alert = await this.alertController.create({
        header: 'Correo inválido',
        message: 'Por favor ingresa un correo electrónico válido.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const updatedUser = {
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      correo: this.user.correo,
      username: this.user.username,
      telefono: this.user.telefono,
    };

    const correoCambio = this.user.correo !== this.correoOriginal;
    const usernameCambio = this.user.username !== this.usernameOriginal;

    if (correoCambio || usernameCambio) {
      const alerta = await this.alertController.create({
        header: 'Confirmar cambios',
        message: 'Estás por cambiar tu correo o nombre de usuario. ¿Deseas continuar?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Confirmar',
            handler: async () => {
              await this.enviarActualizacion(updatedUser);
            }
          }
        ]
      });

      await alerta.present();
      return;
    }

    await this.enviarActualizacion(updatedUser);

    if (!token) {
      console.warn("❌ No hay token. Redirigiendo a login.");
      this.router.navigate(['/login']);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const userId = this.user.id;
    const apiUrl = `https://api-cog73kiucq-uc.a.run.app/api/usuarios_servilink/${userId}`;

    try {
      const response: any = await this.http.put(apiUrl, updatedUser, { headers }).toPromise();

      await this.loadUserData();
      this.showToast('Perfil actualizado exitosamente.');
      this.router.navigate(['/profile']);
    } catch (error: any) {
      console.error("❌ Error en la solicitud de actualización:", error);

      const mensaje = error?.error?.error || 'Ocurrió un error al actualizar el perfil.';
      this.showToast(mensaje); 
    }

  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  async enviarActualizacion(updatedUser: any) {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const userId = this.user.id;
    const apiUrl = `https://api-cog73kiucq-uc.a.run.app/api/usuarios_servilink/${userId}`;

    try {
      await this.http.put(apiUrl, updatedUser, { headers }).toPromise();
      await this.loadUserData();
      this.showToast('Perfil actualizado exitosamente.');
      this.router.navigate(['/profile']);
    } catch (error: any) {
      console.error("❌ Error al actualizar:", error);
      const mensaje = error?.error?.error || 'Ocurrió un error al actualizar.';
      this.showToast(mensaje);
    }
  }

  hayCambios(): boolean {
    if (!this.user) return false;
  
    return (
      this.user.nombre !== this.nombreOriginal ||
      this.user.apellido !== this.apellidoOriginal ||
      this.user.correo !== this.correoOriginal ||
      this.user.username !== this.usernameOriginal ||
      this.user.telefono !== this.telefonoOriginal
    );
  }
  
  

}
