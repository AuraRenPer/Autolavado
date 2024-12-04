import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { ModalController } from '@ionic/angular';
import { ModalCamaraComponent } from '../../components/modal-camara/modal-camara.component';

@Component({
  selector: 'app-consultas-pasadas',
  templateUrl: './consultas-pasadas.page.html',
  styleUrls: ['./consultas-pasadas.page.scss'],
})
export class ConsultasPasadasPage implements OnInit {
  citasPasadas: Array<{ id: string; fechaHora: Date; imagenUrl?: string }> = [];

  constructor(private citasService: CitasService, private modalController: ModalController) {}

  async ngOnInit() {
    // Suscribirse al observable para recibir actualizaciones en tiempo real
    this.citasService.citas$.subscribe((citas) => {
      // Filtrar citas pasadas
      this.citasPasadas = citas
        .filter((cita) => new Date(cita.fechaHora) < new Date())
        .map((cita) => ({
          ...cita,
          fechaHora: new Date(cita.fechaHora),
        }));
      console.log('Citas pasadas actualizadas:', this.citasPasadas);
    });
  }

  // Abre el modal para tomar o seleccionar una foto
  async agregarImagen(citaId: string) {
    const modal = await this.modalController.create({
      component: ModalCamaraComponent,
    });

    await modal.present();

    // Esperar a que el modal se cierre y obtenga la imagen
    const { data } = await modal.onWillDismiss();
    if (data && data.imageUrl) {
      try {
        // Obtener la cita actual
        const citaActual = this.citasPasadas.find((cita) => cita.id === citaId);
        if (citaActual) {
          const nuevaCita = { ...citaActual, imagenUrl: data.imageUrl };

          // Actualizar la cita específica en Firebase
          await this.citasService.actualizarCita(citaId, nuevaCita);
          console.log('Imagen agregada a la cita:', nuevaCita);
        }
      } catch (error) {
        console.error('Error al actualizar la cita:', error);
      }
    }
  }
}
