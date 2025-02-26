import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importamos HttpClient
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

  private apiUrl = 'https://us-central1-autolavado-38624.cloudfunctions.net'; // URL de las funciones

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  // ✅ Obtener clientes desde Firebase Functions
  private cargarClientes() {
    this.http.get(`${this.apiUrl}/obtenerClientes`)
      .subscribe((data: any) => {
        this.clientes = data.clientes;
      }, error => {
        console.error('Error al obtener clientes:', error);
        this.mostrarToast('Error al cargar clientes.', 'danger');
      });
  }

  // ✅ Guardar o actualizar cliente en el backend
  guardarDatos() {
    if (!this.nuevoCliente.nombre.trim() || !this.nuevoCliente.contacto.trim()) {
      this.mostrarToast('Por favor, llena todos los campos.', 'danger');
      return;
    }

    if (this.clienteSeleccionado) {
      // Editar cliente
      this.http.put(`${this.apiUrl}/actualizarCliente`, {
        id: this.clienteSeleccionado.id,
        ...this.nuevoCliente
      }).subscribe(() => {
        this.mostrarToast('Cliente actualizado correctamente.', 'success');
        this.cancelarEdicion();
        this.cargarClientes();
      }, error => {
        console.error('Error al actualizar cliente:', error);
        this.mostrarToast('Error al actualizar cliente.', 'danger');
      });

    } else {
      // Agregar nuevo cliente
      this.http.post(`${this.apiUrl}/registrarCliente`, this.nuevoCliente)
        .subscribe(() => {
          this.mostrarToast('Cliente agregado correctamente.', 'success');
          this.nuevoCliente = { nombre: '', contacto: '' }; // Limpia el formulario
          this.cargarClientes();
        }, error => {
          console.error('Error al agregar cliente:', error);
          this.mostrarToast('Error al agregar cliente.', 'danger');
        });
    }
  }

  // ✅ Seleccionar cliente para edición
  editarCliente(cliente: any) {
    this.clienteSeleccionado = { ...cliente };
    this.nuevoCliente = { ...cliente };
  }

  // ✅ Eliminar cliente
  eliminarCliente(id: string) {
    this.http.delete(`${this.apiUrl}/eliminarCliente?id=${id}`)
      .subscribe(() => {
        this.mostrarToast('Cliente eliminado correctamente.', 'success');
        this.cargarClientes();
      }, error => {
        console.error('Error al eliminar cliente:', error);
        this.mostrarToast('Error al eliminar cliente.', 'danger');
      });
  }

  // ✅ Cancelar edición
  cancelarEdicion() {
    this.clienteSeleccionado = null;
    this.nuevoCliente = { nombre: '', contacto: '' };
  }

  // ✅ Mostrar notificaciones
  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    await toast.present();
  }
}
