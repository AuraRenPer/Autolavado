import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { ModalController } from '@ionic/angular';
import { ModalCamaraComponent } from '../../components/modal-camara/modal-camara.component';

@Component({
  selector: 'app-servicios-pasados',
  templateUrl: './consultas-pasadas.page.html',
  styleUrls: ['./consultas-pasadas.page.scss'],
})
export class ServiciosPasadosPage implements OnInit {
  serviciosPasados: Array<{
    id: string;
    cliente: string;
    vehiculo: string;
    tipoServicio: string;
    fechaHora: Date;
    estado: string;
    imagenUrl?: string;
  }> = [];

  constructor(private serviciosService: ServiciosService, private modalController: ModalController) {}

  async ngOnInit() {
    // Suscribirse al observable para recibir actualizaciones en tiempo real
    this.serviciosService.servicios$.subscribe((servicios) => {
      // Filtrar servicios pasados
      this.serviciosPasados = servicios
        .filter((servicio) => new Date(servicio.fechaHora) < new Date())
        .map((servicio) => ({
          ...servicio,
          fechaHora: new Date(servicio.fechaHora),
        }));
      console.log('Servicios pasados actualizados:', this.serviciosPasados);
    });
  }

  // Abre el modal para tomar o seleccionar una foto
  async agregarImagen(servicioId: string) {
    const modal = await this.modalController.create({
      component: ModalCamaraComponent,
    });
  
    await modal.present();
  
    // Esperar a que el modal se cierre y obtenga la imagen
    const { data } = await modal.onWillDismiss();
    if (data && data.imageUrl) {
      try {
        // Obtener el servicio actual
        const servicioActual = this.serviciosPasados.find((servicio) => servicio.id === servicioId);
        if (servicioActual) {
          const nuevoServicio = {
            ...servicioActual,
            imagenUrl: data.imageUrl,
            fechaHora: servicioActual.fechaHora.toISOString(), // Convertir a cadena ISO
          };
  
          // Actualizar el servicio específico en Firebase
          await this.serviciosService.actualizarServicio(servicioId, nuevoServicio);
          console.log('Imagen agregada al servicio:', nuevoServicio);
        }
      } catch (error) {
        console.error('Error al actualizar el servicio:', error);
      }
    }
  }
}
