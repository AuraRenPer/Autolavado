import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { VideoRecorderComponent } from '../../components/video-recorder/video-recorder.component';

@Component({
  selector: 'app-grabar-consulta',
  templateUrl: './grabar-consulta.page.html',
  styleUrls: ['./grabar-consulta.page.scss'],
})
export class GrabarConsultaPage {
  isMobile: boolean;

  constructor(private modalController: ModalController, private platform: Platform) {
    // Detectamos si estamos en un entorno móvil
    this.isMobile = this.platform.is('mobile') || this.platform.is('cordova') || this.platform.is('capacitor');
  }

  async openVideoRecorderModal() {
    const modal = await this.modalController.create({
      component: VideoRecorderComponent,
    });

    // Esperar a que se cierre el modal y obtener los datos
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Datos del video:', result.data);
        // Puedes manejar los datos del video aquí
      }
    });

    await modal.present();
  }
}
