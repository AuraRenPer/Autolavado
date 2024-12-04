import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async iniciarSesion() {
    if (this.email && this.password) {
      try {
        await this.authService.login(this.email, this.password);
        alert('Inicio de sesión exitoso.');
        this.router.navigate(['/panel-control']); // Redirige al panel principal
      } catch (error) {
        if (error instanceof Error) {
          alert('Error al iniciar sesión: ' + error.message);
        } else {
          alert('Error desconocido al iniciar sesión.');
        }
      }
    } else {
      alert('Por favor, ingresa un correo y una contraseña.');
    }
  }
}
