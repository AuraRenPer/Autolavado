import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-proveedor',
  standalone: false,
  templateUrl: './historial-proveedor.page.html',
  styleUrls: ['./historial-proveedor.page.scss'],
})
export class HistorialProveedorPage implements OnInit {

  solicitudesCompletadas: any[] = [];
  idProveedor = '';

  constructor(
    private serviciosService: ServiciosService,
    private storage: Storage,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const usuario = await this.storage.get('usuario');
    this.idProveedor = usuario?.id || '';
    this.cargarHistorial();
  }

  async cargarHistorial() {
    try {
      const solicitudes = await this.serviciosService.obtenerSolicitudesPorProveedor(this.idProveedor);
      this.solicitudesCompletadas = solicitudes.filter(s => s.estado === 'Completado');
    } catch (error) {
      console.error('❌ Error al obtener historial del proveedor:', error);
    }
  }

  regresar() {
    this.router.navigate(['/home']);
  }
}
