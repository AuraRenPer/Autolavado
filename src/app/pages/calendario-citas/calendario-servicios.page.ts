import { Component } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular'; 

@Component({
  selector: 'app-calendario-servicios',
  templateUrl: './calendario-servicios.page.html',
  styleUrls: ['./calendario-servicios.page.scss'],
})
export class CalendarioServiciosPage {
  mostrarVehiculo: boolean = false;
  serviciosProximos: any[] = []; 
  usuario: any;
  proveedorSeleccionado: any;
  servicioSeleccionado: any;
  servicio: any = {}; 
  idVehiculo: string = '';

  constructor(
    private alertController: AlertController,
    private serviciosService: ServiciosService,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.usuario = this.authService.getUsuario();
    console.log('👤 Usuario cargado:', this.usuario);
  
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
  
    if (state) {
      this.proveedorSeleccionado = state['proveedor'];
      const servicio = state['servicio'];
  
      console.log('📦 Proveedor recibido (por navegación):', this.proveedorSeleccionado);
      console.log('📦 Servicio recibido (por navegación):', servicio);
  
      this.servicio.tipoServicio = servicio.nombre;
      this.servicio.precio = servicio.precio;
      this.servicio.duracion = servicio.duracion;
      this.servicio.id = servicio.id;
      this.servicio.autolavado = this.proveedorSeleccionado.nombreAutolavado;
  
    } else {
      const datosGuardados = JSON.parse(localStorage.getItem('seleccionAutolavado') || '{}');
  
      if (datosGuardados?.idProveedor && datosGuardados?.idServicio) {
        this.servicio.tipoServicio = datosGuardados.nombreServicio;
        this.servicio.precio = datosGuardados.precioServicio;
        this.servicio.duracion = datosGuardados.duracionServicio;
        this.servicio.id = datosGuardados.idServicio;
        this.servicio.autolavado = datosGuardados.nombreProveedor;
  
        this.proveedorSeleccionado = { id: datosGuardados.idProveedor, nombreAutolavado: datosGuardados.nombreProveedor };
  
        console.log('📦 Proveedor desde localStorage:', this.proveedorSeleccionado);
      } else {
        console.warn("⚠️ No se encontraron datos para mostrar.");
      }
    }
  }
  
  

  /**
   * Paso 1: Guardar vehículo y luego agendar cita
   */
  async guardarVehiculoYAgendarCita() {
    if (!this.usuario || !this.usuario.id) {
      console.error("⚠️ Usuario no definido.");
      return;
    }
    
    const vehiculoData = {
      idUsuario: this.usuario.id,
      marca: this.servicio.marca,
      modelo: this.servicio.modelo,
      year: this.servicio.year,
      placa: this.servicio.placa,
      color: this.servicio.color,
    };
  
    try {
      const res = await this.serviciosService.guardarVehiculo(vehiculoData);
      console.log('✅ Respuesta del guardado de vehículo:', res);
      
      this.idVehiculo = res.id;
      
      if (this.idVehiculo) {
        console.log('✅ Vehículo guardado con ID:', this.idVehiculo);
        await this.agendarCita();
      } else {
        console.error("❌ No se pudo obtener el ID del vehículo.");
      }
    } catch (error) {
      console.error('❌ Error al guardar vehículo:', error);
    }
  }
  
  /**
   * Paso 2: Agendar cita usando el ID del vehículo
   */
  async agendarCita() {
    const fechaHora = this.servicio.fechaHora;

    const nuevaCita = {
      idUsuario: this.usuario.id,
      idProveedor: this.proveedorSeleccionado.id,
      idServicio: this.servicio.id || 'servicioPorDefinir',
      idVehiculo: this.idVehiculo,
      fechaCita: fechaHora,
      horaCita: fechaHora, // si separas hora en otro campo, cámbialo
      estatus: 'Pendiente',
    };

    try {
      const res = await this.serviciosService.agendarCita(nuevaCita);
      console.log('✅ Cita agendada:', res);
      await this.mostrarMensajeCitaAgendada(); // mostrar el mensaje

    } catch (error) {
      console.error('❌ Error al agendar cita:', error);
    }
  }

  async confirmarCancelar() {
    const alert = await this.alertController.create({
      header: '¿Cancelar cita?',
      message: 'Si regresas al menú principal, perderás los datos ingresados. ¿Deseas continuar?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.navCtrl.navigateBack('/panel-control');
          }
        }
      ]
    });
  
    await alert.present();
  }

  async mostrarMensajeCitaAgendada() {
    const alert = await this.alertController.create({
      header: '✅ Cita agendada',
      message: 'Tu cita fue registrada exitosamente.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateRoot('/panel-control'); // vuelve al panel
          }
        }
      ]
    });
  
    await alert.present();
  }
  


  limpiarFormulario() {
    this.servicio = {
      id: '',
      cliente: '',
      vehiculo: '',
      tipoServicio: '',
      fechaHora: '',
      autolavado: '',
      precio: '',
      duracion: '',
      marca: '',
      modelo: '',
      year: '',
      placa: '',
      color: ''
    };
  }
}
