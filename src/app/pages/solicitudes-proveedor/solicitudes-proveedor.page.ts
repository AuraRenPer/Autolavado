import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-solicitudes-proveedor',
  standalone: false,
  templateUrl: './solicitudes-proveedor.page.html',
  styleUrls: ['./solicitudes-proveedor.page.scss'],
})
export class SolicitudesProveedorPage implements OnInit {
  idProveedor: string = '';
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  estadoSeleccionado = 'Pendiente';
  cargandoSolicitudes = false;

  constructor(
    private serviciosService: ServiciosService,
    private storage: Storage,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
    
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const usuario = this.authService.getUsuario();
    const idUsuario = usuario?.id;
    
    if (!idUsuario) {
      console.warn('⚠️ No hay idUsuario');
      return;
    }
    
    try {
      const proveedor: any = await this.serviciosService.obtenerProveedorPorUsuario(idUsuario);
      this.idProveedor = proveedor?.id;
    
      if (!this.idProveedor) {
        console.warn('⚠️ No se encontró el proveedor');
        return;
      }
    
      this.cargarSolicitudes();
    } catch (error) {
      console.error('❌ Error al obtener proveedor:', error);
    }
    
    
  }

  filtrarSolicitudes() {
    this.solicitudesFiltradas = this.solicitudes.filter(s => s.estado === this.estadoSeleccionado);
  }
  

  async cargarSolicitudes() {
    this.cargandoSolicitudes = true;

    try {
      const usuario = this.authService.getUsuario();
      const idUsuario = usuario?.id;
  
      if (!idUsuario) {
        console.warn('⚠️ No hay idUsuario');
        return;
      }
  
      const proveedor: any = await this.serviciosService.obtenerProveedorPorUsuario(idUsuario);
      this.idProveedor = proveedor?.id;
  
      if (!this.idProveedor) {
        console.warn('⚠️ No se encontró el proveedor');
        return;
      }
  
      const data = await this.serviciosService.obtenerSolicitudesPopuladasPorProveedor(this.idProveedor);
  
      this.solicitudes = data?.data || [];
      this.filtrarSolicitudes();
      console.log("filtrar solicitudes:", this.filtrarSolicitudes);
      this.cargandoSolicitudes = false;  
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    }
  }
  
  

  async actualizarEstado(idSolicitud: string, nuevoEstado: string) {
    try {
      await this.serviciosService.actualizarEstadoSolicitud(idSolicitud, nuevoEstado);

      await this.cargarSolicitudes();
      this.estadoSeleccionado = nuevoEstado; 
      this.filtrarSolicitudes();
      

      const alerta = await this.alertController.create({
        header: 'Estado actualizado',
        message: `La solicitud fue marcada como ${nuevoEstado}.`,
        buttons: ['OK'],
      });
      await alerta.present();
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
    }
  }

  segmentChanged(event: any) {
    this.estadoSeleccionado = event.detail.value;
    this.filtrarSolicitudes();
  }

  regresar() {
    this.router.navigate(['/home']);
  }
  
  
}
