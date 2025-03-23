import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { ModalController } from '@ionic/angular';
import { ModalCamaraComponent } from '../../components/modal-camara/modal-camara.component';
import { AuthService } from '../../services/auth.service'; // Importar el servicio de autenticación

@Component({
  selector: 'app-servicios-pasados',
  templateUrl: './consultas-pasadas.page.html',
  styleUrls: ['./consultas-pasadas.page.scss'],
})
export class ServiciosPasadosPage implements OnInit {
  serviciosPasados: {
    id: string;
    fechaRealizacion: Date;
    nombreServicio: string;
    nombreAutolavado: string;
    estatus: string;
    imagenUrl?: string;
  }[] = [];
  usuario: any;
  cargandoHistorial = true; // 🔄 Al principio está cargando

  constructor(private serviciosService: ServiciosService, private modalController: ModalController, private authService: AuthService,) { }

  async ngOnInit() {
    this.usuario = this.authService.getUsuario(); // ← Agrega esto
    console.log("👤 Usuario cargado:", this.usuario);

    await this.cargarHistorial();
  }


  async cargarHistorial() {
    this.cargandoHistorial = true;
  
    setTimeout(async () => {
      console.log("ID USUARIO", this.usuario?.id);
      if (!this.usuario || !this.usuario.id) {
        console.warn("⚠ No se puede cargar citas porque el usuario no está disponible.");
        this.cargandoHistorial = false;
        return;
      }
  
      const historiales = (await this.serviciosService.obtenerHistorialUsuario(this.usuario.id).toPromise()) || [];
      const ahora = new Date();
  
      console.log("Historiales del usuario", historiales);
  
      if (!historiales || historiales.length === 0) {
        this.serviciosPasados = [];
        this.cargandoHistorial = false;
        return;
      }
  
      const proveedores = await this.serviciosService.obtenerTodosLosProveedores().toPromise();
      const citas = await this.serviciosService.obtenerCitasPorUsuario(this.usuario.id).toPromise();
  
      const citasEnriquecidas = await Promise.all(
        historiales.map(async (historial) => {
          const citaEnriquecida: any = {
            id: historial.id,
            fechaRealizacion: new Date(historial.fechaRealizacion),
            estatus: historial.estatus || "Sin estado"
          };
  
          const proveedorEncontrado = (proveedores ?? []).find(p => p.id === historial.idProveedor);
          citaEnriquecida.nombreAutolavado = proveedorEncontrado?.nombreAutolavado || "Autolavado desconocido";
  
          const citaEncontrada = (citas ?? []).find(p => p.id === historial.idCita);
          citaEnriquecida.estatus = citaEncontrada?.estado || "Sin estatus";
  
          try {
            const servicios = await this.serviciosService.obtenerServiciosPorProveedor(historial.idProveedor).toPromise();
            const servicioEncontrado = (servicios ?? []).find(s => s.id === historial.idServicio);
            citaEnriquecida.nombreServicio = servicioEncontrado?.nombre || "Servicio desconocido";
          } catch (error) {
            console.warn("❌ Error al obtener servicios del proveedor:", error);
            citaEnriquecida.nombreServicio = "Servicio no disponible";
          }
  
          return citaEnriquecida;
        })
      );
  
      this.serviciosPasados = citasEnriquecidas;
      this.cargandoHistorial = false;
    }, 2000); // Esperar 2 segundos
  }


  
   getColorEstado(estatus: string): string {
    switch (estatus.toLowerCase()) {
      case 'completado':
        return 'success'; // Verde
      case 'cancelado':
        return 'danger';  // Rojo
      case 'pendiente':
        return 'warning'; // Amarillo
      default:
        return 'medium';  // Gris por defecto
    }
  }


}


