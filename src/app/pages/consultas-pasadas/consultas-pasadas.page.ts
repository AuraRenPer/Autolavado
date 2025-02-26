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
  serviciosPasados: Array<any> = [];

  constructor(private serviciosService: ServiciosService, private modalController: ModalController) {}

  async ngOnInit() {
    await this.cargarServiciosPasados();
  }
  

  async cargarServiciosPasados() {
    try {
      const servicios = (await this.serviciosService.obtenerServicios().toPromise()) || []; // ✅ Asegurar que `servicios` sea un array
  
      const ahora = new Date();
      this.serviciosPasados = servicios
        .filter((servicio) => servicio && servicio.fechaHora && new Date(servicio.fechaHora) < ahora)
        .map((servicio) => ({
          ...servicio,
          fechaHora: new Date(servicio.fechaHora), // ✅ Convertir a objeto Date
        }));
  
      console.log('✅ Servicios pasados actualizados:', this.serviciosPasados);
    } catch (error) {
      console.error('❌ Error al cargar servicios pasados:', error);
      this.serviciosPasados = []; // ✅ En caso de error, asignar un array vacío para evitar más errores.
    }
  }
  

  async agregarImagen(servicioId: string) {
    const modal = await this.modalController.create({
      component: ModalCamaraComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.imageUrl) {
      try {
        // Buscar el servicio actual
        const servicioActual = this.serviciosPasados.find((servicio) => servicio.id === servicioId);
        if (servicioActual) {
          const nuevoServicio = {
            ...servicioActual,
            imagenUrl: data.imageUrl,
            fechaHora: servicioActual.fechaHora instanceof Date ? servicioActual.fechaHora.toISOString() : servicioActual.fechaHora, // Convertir fecha correctamente
          };

          // Actualizar el servicio en Firebase
          await this.serviciosService.actualizarServicio(servicioId, nuevoServicio);
          console.log('✅ Imagen agregada al servicio:', nuevoServicio);
          await this.cargarServiciosPasados(); // Recargar servicios
        }
      } catch (error) {
        console.error('❌ Error al actualizar el servicio:', error);
      }
    }
  }
}
