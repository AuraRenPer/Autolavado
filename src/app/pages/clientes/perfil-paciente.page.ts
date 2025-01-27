import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
})
export class PerfilPacientePage implements OnInit {
  clientes: any[] = []; // Lista de clientes
  nuevoCliente = { nombre: '', contacto: '' }; // Cliente nuevo o editado
  clienteSeleccionado: any = null; // Cliente seleccionado para edición
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
      this.cargarClientes();
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  // Cargar clientes desde Firebase
  private cargarClientes() {
    if (!this.userId) return;

    const clientesRef = ref(this.database, `Clientes`);
    onValue(clientesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.clientes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        console.log('Clientes cargados:', this.clientes);
      } else {
        this.clientes = [];
        console.log('No se encontraron clientes de firebase.');
      }
    });
  }

  guardarDatos() {
    if (this.nuevoCliente.nombre && this.nuevoCliente.contacto) {
      if (!this.userId) {
        alert('Usuario no autenticado. No se pueden guardar los datos.');
        return;
      }

      const pacienteRef = ref(this.database, `users/${this.userId}/paciente`);
      set(pacienteRef, {
        nombre: this.nuevoCliente.nombre,
        contacto: this.nuevoCliente.contacto,
        comentarios: [],
      })
        .then(() => {
          console.log('Datos del paciente guardados.');
          this.datosGuardados = {
            nombre: this.nuevoCliente.nombre,
            contacto: this.nuevoCliente.contacto,
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
