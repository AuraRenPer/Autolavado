import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    if (this.email && this.password) {
      try {
        await this.authService.register(this.email, this.password);
        alert('Usuario registrado exitosamente.');
        this.router.navigate(['/panel-control']); // Redirige al panel principal después de registrar
      } catch (error) {
        if (error instanceof Error) {
          alert('Error al registrar el usuario: ' + error.message);
        } else {
          alert('Error desconocido al registrar el usuario.');
        }
      }
    } else {
      alert('Por favor, ingresa un correo y una contraseña.');
    }
  }
}
