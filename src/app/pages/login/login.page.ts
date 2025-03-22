import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; 
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private route: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]]
    });
  }

  /**
   * Validación personalizada para la contraseña:
   * - Mínimo 6 caracteres
   * - Al menos 1 número
   * - Al menos 1 carácter especial
   */
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasNumber || !hasSpecialChar) {
      return { passwordStrength: true };
    }
    return null;
  }

  /**
   * Método para iniciar sesión
   */
  async iniciarSesion() {
    if (this.loginForm.invalid) {
      this.showToast('Por favor, ingresa un usuario/correo y contraseña válidos.');
      return;
    }
  
    const credentials = {
      login: this.loginForm.value.login.trim(),  // ✅ Usamos "login" ya que puede ser username o correo
      password: this.loginForm.value.password.trim()
    };
    console.log("📡 Enviando al backend:", credentials);

    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...', spinner: 'circles' });
    await loading.present();
  
    try {
      const result = await this.authService.loginUser(credentials); // 🔹 Se envía `login`
  
      if (result.success) {
        const usuario = this.authService.getUsuario();
        console.log("🧾 Usuario cargado tras login:", usuario);
        this.showToast('Inicio de sesión exitoso.');
        this.route.navigate(['/panel-control']);
      } else {
        this.showToast(result.message);
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.showToast('Ocurrió un error inesperado.');
    } finally {
      loading.dismiss();
    }
  }
  

  /**
   * Cambia la visibilidad de la contraseña.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  goRegister() {
    this.route.navigate(['/registro']);
  }
}
