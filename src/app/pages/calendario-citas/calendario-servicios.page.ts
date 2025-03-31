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
  serviciosProximos: any[] = [];
  usuario: any;
  proveedorSeleccionado: any;
  servicioSeleccionado: any;
  servicio: any = {};
  minFecha = new Date().toISOString();

  constructor(
    private alertController: AlertController,
    private serviciosService: ServiciosService,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.usuario = this.authService.getUsuario();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;

    if (state) {
      this.proveedorSeleccionado = state['proveedor'];
      const servicio = state['servicio'];


      this.servicio.tipoServicio = servicio.nombre;
      this.servicio.precio = servicio.precio;
      this.servicio.duracion = servicio.duracion;
      this.servicio.id = servicio.id;
      this.servicio.autolavado = this.proveedorSeleccionado.nombreEmpresa;

    } else {
      const datosGuardados = JSON.parse(localStorage.getItem('seleccionAutolavado') || '{}');

      if (datosGuardados?.idProveedor && datosGuardados?.idServicio) {
        this.servicio.tipoServicio = datosGuardados.nombreServicio;
        this.servicio.precio = datosGuardados.precioServicio;
        this.servicio.duracion = datosGuardados.duracionServicio;
        this.servicio.id = datosGuardados.idServicio;
        this.servicio.autolavado = datosGuardados.nombreProveedor;

        this.proveedorSeleccionado = { id: datosGuardados.idProveedor, nombreEmpresa: datosGuardados.nombreProveedor };

      } else {
        console.warn("⚠️ No se encontraron datos para mostrar.");
      }
    }
  }



  /**
   * Paso 1: Guardar vehículo y luego agendar cita
   */
  async AgendarCita() {
    const fechaHoraRaw = this.servicio.fechaHora;

    if (!fechaHoraRaw) {
      const alerta = await this.alertController.create({
        header: 'Fecha y hora requerida',
        message: 'Por favor selecciona una fecha y hora para la cita.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }
    
    const fechaHora = new Date(fechaHoraRaw);
    
    if (isNaN(fechaHora.getTime())) {
      const alerta = await this.alertController.create({
        header: 'Fecha inválida',
        message: 'La fecha y hora seleccionadas no son válidas.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }
    
    
    const ahora = new Date();
    ahora.setSeconds(0, 0); // Ignora milisegundos para comparar con precisión

    // Validar fecha pasada
    const soloFecha = new Date(fechaHora);
    soloFecha.setHours(0, 0, 0, 0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (soloFecha < hoy) {
      const alerta = await this.alertController.create({
        header: 'Fecha inválida',
        message: 'No puedes agendar citas en días anteriores a hoy.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    // Validar hora pasada si es el mismo día
    if (soloFecha.getTime() === hoy.getTime() && fechaHora.getTime() < ahora.getTime()) {
      const alerta = await this.alertController.create({
        header: 'Hora inválida',
        message: 'No puedes agendar en una hora que ya pasó hoy.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    // Validar horario laboral (8 AM - 6 PM)
    const hora = fechaHora.getHours();
    if (hora < 8 || hora > 18) {
      const alerta = await this.alertController.create({
        header: 'Horario fuera de servicio',
        message: 'Solo puedes agendar entre las 8:00 AM y 6:00 PM.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    const nuevaCita = {
      idUsuario: this.usuario.id,
      idProveedor: this.proveedorSeleccionado.id,
      idServicio: this.servicio.id || 'servicioPorDefinir',
      fechaCita: fechaHora,
      horaCita: fechaHora.toISOString(), // <- aseguramos que es un string válido
      estatus: 'Pendiente',
    };
    

    const citasProveedor = await this.serviciosService.obtenerCitasPorProveedor(this.proveedorSeleccionado.id);

    const yaReservada = citasProveedor.find(c =>
      c.fechaCita === fechaHora.toISOString().split('T')[0] &&
      c.horaCita === fechaHora.toISOString()
    );

    if (yaReservada) {
      const alerta = await this.alertController.create({
        header: 'Horario no disponible',
        message: 'Este proveedor ya tiene una cita en esa fecha y hora. Por favor elige otro horario.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }


    try {
      const res = await this.serviciosService.agendarCita(nuevaCita);


      // Si la respuesta tiene el id de la cita
      if (res && res.idCita) {
        const nuevoHistorial = {
          idCita: res.idCita,
          idUsuario: this.usuario.id,
          idProveedor: this.proveedorSeleccionado.id,
          idServicio: this.servicio.id || 'servicioPorDefinir',
          fechaRealizacion: fechaHora,
          estatus: 'Pendiente'
        };

        await this.serviciosService.crearHistorial(nuevoHistorial);

        // ✅ Crear solicitud para el proveedor
        const nuevaSolicitud = {
          idCita: res.idCita,
          idUsuario: this.usuario.id,
          idProveedor: this.proveedorSeleccionado.id,
          idServicio: this.servicio.id || 'servicioPorDefinir',
          estado: 'Pendiente'
        };

        await this.serviciosService.crearSolicitud(nuevaSolicitud);
      }

      await this.mostrarMensajeCitaAgendada();

    } catch (error: any) {
      const mensaje = error?.error?.error || 'Ocurrió un error al agendar la cita. Intenta más tarde.';

      const alerta = await this.alertController.create({
        header: 'Error',
        message: mensaje,
        buttons: ['OK']
      });
      await alerta.present();
    }


  }

  async confirmarCancelar() {
    const alert = await this.alertController.create({
      header: '¿Cancelar cita?',
      message: 'Si regresas al menú principal, perderás los datos ingresados. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
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
      header: 'Cita agendada',
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
