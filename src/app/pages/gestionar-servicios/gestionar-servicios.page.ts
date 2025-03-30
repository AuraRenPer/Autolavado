import { Component, OnInit } from '@angular/core'; 
import { ServiciosService } from '../../services/servicios.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestionar-servicios',
  standalone: false, 
  templateUrl: './gestionar-servicios.page.html',
  styleUrls: ['./gestionar-servicios.page.scss'],
})
export class GestionarServiciosPage implements OnInit {
  servicios: any[] = [];
  cargandoServicios: boolean = false;

  

  constructor(
    private serviciosService: ServiciosService, // Aquí usas ServiciosService
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private authService: AuthService,
    private http: HttpClient

) {}


  ngOnInit() {
    this.cargarServicios();
  }

  regresarHomeProveedor() {
    this.navCtrl.navigateBack('/panel-control');
  }

  async cargarServicios() {
    this.cargandoServicios = true;
    const idProveedor = await this.obtenerIdProveedorPorUsuario();
    console.log("ID PROVEEDOR", idProveedor);
  
    if (!idProveedor) {
      console.warn('No se encontró el proveedor asociado.');
      this.cargandoServicios = false;
      return;
    }
  
    const servicios = await this.serviciosService.obtenerServiciosPorProveedor(idProveedor).toPromise();
    this.servicios = servicios ?? [];
    this.cargandoServicios = false;
  }
  

  obtenerIdProveedor(): string | null {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?.idProveedor || null;
    
  }

  async obtenerIdProveedorPorUsuario(): Promise<string | null> {
    const usuario = this.authService.getUsuario();
    const idUsuario = usuario?.id;
  
    if (!idUsuario) return null;
  
    try {
      const proveedor: any = await this.http
        .get(`https://api-cog73kiucq-uc.a.run.app/api/proveedores/obtenerPorUsuario/${idUsuario}`)
        .toPromise();
  
      return proveedor?.id || null;
    } catch (error) {
      console.error('❌ Error al obtener proveedor por usuario:', error);
      return null;
    }
  }
  
  

  async agregarServicio() {
    const alert = await this.alertController.create({
      header: 'Agregar Servicio',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre del servicio' },
        { name: 'descripcionProblema', type: 'text', placeholder: 'Descripción del problema' },
        { name: 'duracion', type: 'text', placeholder: 'Duración (ej. 1 hora 30 min)' },
        { name: 'precio', type: 'number', placeholder: 'Precio' },
        { name: 'tipoServicio', type: 'text', placeholder: 'Tipo de servicio' },
        { name: 'imagen', type: 'text', placeholder: 'URL de la imagen' },
        { name: 'direccion', type: 'text', placeholder: 'Dirección' },
        { name: 'lat', type: 'number', placeholder: 'Latitud' },
        { name: 'lng', type: 'number', placeholder: 'Longitud' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              const idProveedor = await this.obtenerIdProveedor();
              if (!idProveedor) {
                this.mostrarToast('No se encontró el ID del proveedor', 'warning');
                return;
              }
              data.idProveedor = idProveedor;
              await this.serviciosService.agregarServicio(data);
              this.cargarServicios();
              this.mostrarToast('Servicio agregado exitosamente', 'success');
            } catch (error) {
              this.mostrarToast('Error al agregar el servicio', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editarServicio(servicio: any) {
    const alert = await this.alertController.create({
      header: 'Editar Servicio',
      inputs: [
        { name: 'nombre', type: 'text', value: servicio.nombre, placeholder: 'Nombre del servicio' },
        { name: 'descripcionProblema', type: 'text', value: servicio.descripcionProblema, placeholder: 'Descripción del problema' },
        { name: 'duracion', type: 'text', value: servicio.duracion, placeholder: 'Duración (ej. 1 hora 30 min)' },
        { name: 'precio', type: 'number', value: servicio.precio, placeholder: 'Precio' },
        { name: 'tipoServicio', type: 'text', value: servicio.tipoServicio, placeholder: 'Tipo de servicio' },
        { name: 'imagen', type: 'text', value: servicio.imagen, placeholder: 'URL de la imagen' },
        { name: 'direccion', type: 'text', value: servicio.direccion, placeholder: 'Dirección' },
        { name: 'lat', type: 'number', value: servicio.lat, placeholder: 'Latitud' },
        { name: 'lng', type: 'number', value: servicio.lng, placeholder: 'Longitud' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              const idProveedor = await this.obtenerIdProveedor();
              if (!idProveedor) {
                this.mostrarToast('No se encontró el ID del proveedor', 'warning');
                return;
              }
              data.idProveedor = idProveedor;
              await this.serviciosService.actualizarServicio(servicio.id, data);
              this.cargarServicios();
              this.mostrarToast('Servicio actualizado exitosamente', 'success');
            } catch (error) {
              this.mostrarToast('Error al actualizar el servicio', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarServicio(id: string) {
    try {
      await this.serviciosService.eliminarServicio(id);
      this.cargarServicios();
      this.mostrarToast('Servicio eliminado correctamente', 'success');
    } catch (error) {
      this.mostrarToast('Error al eliminar el servicio', 'danger');
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}
