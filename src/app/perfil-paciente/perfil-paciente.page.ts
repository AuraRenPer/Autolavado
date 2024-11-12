import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
})
export class PerfilPacientePage {
  paciente = {
    nombre: '',
    contacto: '',
    comentarios: []
  };
  datosGuardados: { nombre: string; contacto: string; comentarios: string[] } | null = null;
  nuevoComentario: string = '';

  guardarDatos() {
    if (this.paciente.nombre && this.paciente.contacto) {
      this.datosGuardados = {
        nombre: this.paciente.nombre,
        contacto: this.paciente.contacto,
        comentarios: []
      };
    } else {
      alert('Por favor, ingresa el nombre y el contacto del paciente.');
    }
  }

  agregarComentario() {
    if (this.nuevoComentario.trim()) {
      this.datosGuardados?.comentarios.push(this.nuevoComentario);
      this.nuevoComentario = '';
    }
  }
}
