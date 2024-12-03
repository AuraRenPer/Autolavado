import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
})
export class PerfilPacientePage implements OnInit {
  paciente = {
    nombre: '',
    contacto: '',
  };
  datosGuardados: { nombre: string; contacto: string; comentarios: string[] } | null = null;
  nuevoComentario: string = '';

  private userId: string | null = null;
  private database = getDatabase();

  constructor() {}

  ngOnInit() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      this.userId = currentUser.uid;
      this.cargarDatosPaciente();
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  private cargarDatosPaciente() {
    if (!this.userId) return;

    const pacienteRef = ref(this.database, `users/${this.userId}/paciente`);
    onValue(pacienteRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.datosGuardados = {
          nombre: data.nombre,
          contacto: data.contacto,
          comentarios: data.comentarios || [],
        };
        console.log('Datos del paciente cargados:', this.datosGuardados);
      } else {
        console.log('No hay datos guardados para este paciente.');
      }
    });
  }

  guardarDatos() {
    if (this.paciente.nombre && this.paciente.contacto) {
      if (!this.userId) {
        alert('Usuario no autenticado. No se pueden guardar los datos.');
        return;
      }

      const pacienteRef = ref(this.database, `users/${this.userId}/paciente`);
      set(pacienteRef, {
        nombre: this.paciente.nombre,
        contacto: this.paciente.contacto,
        comentarios: [],
      })
        .then(() => {
          console.log('Datos del paciente guardados.');
          this.datosGuardados = {
            nombre: this.paciente.nombre,
            contacto: this.paciente.contacto,
            comentarios: [],
          };
        })
        .catch((error) => {
          console.error('Error al guardar los datos del paciente:', error);
        });
    } else {
      alert('Por favor, ingresa el nombre y el contacto del paciente.');
    }
  }

  agregarComentario() {
    if (this.nuevoComentario.trim() && this.datosGuardados && this.userId) {
      const comentariosRef = ref(this.database, `users/${this.userId}/paciente/comentarios`);
      const nuevoComentarioRef = push(comentariosRef);

      set(nuevoComentarioRef, this.nuevoComentario)
        .then(() => {
          console.log('Comentario agregado:', this.nuevoComentario);
          this.nuevoComentario = ''; // Limpia el campo de texto después de guardar
        })
        .catch((error) => {
          console.error('Error al agregar comentario:', error);
        });
    } else {
      alert('Por favor, ingresa un comentario válido.');
    }
  }
}
