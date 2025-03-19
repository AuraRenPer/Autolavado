import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  registroForm: FormGroup;
  showPassword: boolean = false;
  showErrorAlert: any;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private route: Router,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {
    this.registroForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      username: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      birthDate: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  /**
   * Validación personalizada para la contraseña:
   * Debe contener al menos 6 caracteres, un número y un carácter especial.
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
   * Validación de coincidencia de contraseñas.
   */
  passwordsMatch(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
  }

  get passwordsDoNotMatch(): boolean {
    return !!this.registroForm.hasError('passwordsMismatch') &&
      !!this.registroForm.get('confirmPassword')?.touched;
  }

  /**
   * Transforma el nombre a mayúsculas automáticamente.
   */
  convertToUppercase() {
    const fullNameControl = this.registroForm.get('fullname');
    if (fullNameControl) {
      fullNameControl.setValue(fullNameControl.value.toUpperCase(), { emitEvent: false });
    }
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const { fullname, email, username, password, confirmPassword, birthDate } = this.registroForm.value;

    if (password !== confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }

    const [nombre, ...apellidoArr] = fullname.trim().split(' ');
    const apellido = apellidoArr.join(' ') || 'N/A';

    const telefono = '0000000000';

    const loading = await this.loadingCtrl.create({
      message: 'Registrando usuario...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const result = await this.authService.registerUser(nombre, apellido, email, password, username, telefono);

      if (result.success) {
        console.log('Registro exitoso');
        await loading.dismiss();

        // mensaje de éxito
        const alert = await this.alertCtrl.create({
          header: 'Registro Exitoso',
          message: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.navCtrl.navigateRoot('/login');
            }
          }]
        });
        await alert.present();
      } else {
        // Manejar errores específicos de correo y username
        if (result.message.includes("correo")) {
          this.registroForm.controls["email"].setErrors({ emailTaken: true });
        }
        if (result.message.includes("nombre de usuario")) {
          this.registroForm.controls["username"].setErrors({ usernameTaken: true });
        }
      }
    } catch (error) {
      console.error('Error en registro:', error);
      await loading.dismiss();
      this.showErrorAlert('Ocurrió un error inesperado. Intenta nuevamente.');
    }
  }


  /**
   * Cambia la visibilidad de la contraseña.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToLogin() {
    this.route.navigate(['/login']);
  }
}
