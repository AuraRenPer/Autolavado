import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, set, push, onValue, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
})
export class PerfilPacientePage implements OnInit {
  clientes: any[] = []; // Lista de clientes
  nuevoCliente = { nombre: '', contacto: '' }; // Cliente nuevo o editado
  clienteSeleccionado: any = null; // Cliente seleccionado para edición
  datosGuardados: { nombre: string; contacto: string; } | null = null;

  private userId: string | null = null;
  private database = getDatabase();

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

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
    if (!this.nuevoCliente.nombre.trim() || !this.nuevoCliente.contacto.trim()) {
      this.mostrarToast('Por favor, llena todos los campos.', 'danger');
      return;
    }

    if (this.clienteSeleccionado) {
      // Actualizar cliente existente
      const clienteRef = ref(this.database, `Clientes/${this.clienteSeleccionado.id}`); // Ajusta la ruta
      update(clienteRef, this.nuevoCliente)
        .then(() => {
          this.mostrarToast('Cliente actualizado correctamente.', 'success');
          this.cancelarEdicion();
        })
        .catch((error) => {
          console.error('Error al actualizar cliente:', error);
          this.mostrarToast('Error al actualizar cliente.', 'danger');
        });
    } else {
      // Agregar nuevo cliente
      const clientesRef = ref(this.database, `Clientes`); // Ajusta la ruta
      const nuevoClienteRef = push(clientesRef);
      set(nuevoClienteRef, this.nuevoCliente)
        .then(() => {
          this.mostrarToast('Cliente agregado correctamente.', 'success');
          this.nuevoCliente = { nombre: '', contacto: '' }; // Limpia el formulario
        })
        .catch((error) => {
          console.error('Error al agregar cliente:', error);
          this.mostrarToast('Error al agregar cliente.', 'danger');
        });
    }
  }


  // Seleccionar cliente para edición
  editarCliente(cliente: any) {
    this.clienteSeleccionado = { ...cliente };
    this.nuevoCliente = { ...cliente };
  }

  // Confirmación antes de eliminar cliente
  eliminarCliente(id: string) {
    const clienteRef = ref(this.database, `Clientes/${id}`); 
    remove(clienteRef)
      .then(() => {
        this.mostrarToast('Cliente eliminado correctamente.', 'success');
      })
      .catch((error) => {
        console.error('Error al eliminar cliente:', error);
        this.mostrarToast('Error al eliminar cliente.', 'danger');
      });
  }
  

  // Eliminar cliente después de confirmación
  private confirmarEliminarCliente(id: string) {
    const clienteRef = ref(this.database, `Clientes/${id}`);
    remove(clienteRef)
      .then(() => {
        this.mostrarToast('Cliente eliminado correctamente.', 'success');
      })
      .catch((error) => {
        console.error('Error al eliminar cliente:', error);
        this.mostrarToast('Error al eliminar cliente.', 'danger');
      });
  }

  // Cancelar edición
  cancelarEdicion() {
    this.clienteSeleccionado = null;
    this.nuevoCliente = { nombre: '', contacto: '' };
  }

  // Mostrar notificaciones
  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    await toast.present();
  }

}
