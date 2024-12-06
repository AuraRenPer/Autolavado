import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { NotificationService } from './services/notification.service';
import { Motion } from '@capacitor/motion';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private isAlertActive = false; // Estado para controlar si el alert está activo
  private motionListener: any; // Listener para el acelerómetro
  private threshold = 30; // Umbral para detectar caídas (ajusta según sea necesario)

  constructor(
    private notificationService: NotificationService,
    private alertController: AlertController,
    private callNumber: CallNumber
  ) {}

  ngOnInit() {
    console.log('AppComponent: Inicializando');
    this.initializeNotifications();
    this.startListeningToMotion();
  }

  ngOnDestroy() {
    console.log('AppComponent: Destruyendo');
    this.stopListeningToMotion();
  }

  private initializeNotifications() {
    console.log('AppComponent: Inicializando notificaciones');
  }

  // Iniciar la escucha del acelerómetro
  private startListeningToMotion() {
    console.log('AppComponent: Iniciando escucha del acelerómetro');
    this.motionListener = Motion.addListener('accel', (event) => {
      const { x, y, z } = event.acceleration;
      console.log(`Movimiento detectado: x=${x}, y=${y}, z=${z}`);

      // Calcular la magnitud del vector de aceleración
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Comparar con el umbral para detectar caídas
      if (magnitude > this.threshold) {
        console.log('¡Posible caída detectada!');
        this.handleFallDetected();
      }
    });
  }

  // Detener la escucha del acelerómetro
  private stopListeningToMotion() {
    if (this.motionListener) {
      this.motionListener.remove();
      console.log('AppComponent: Listener del acelerómetro eliminado');
    }
  }

  async handleFallDetected() {
    // Verificar si ya hay un alert activo
    if (this.isAlertActive) {
      console.log('Un alert ya está activo. Ignorando detección de caída.');
      return;
    }

    console.log('¡Se detectó una caída!');
    this.isAlertActive = true; // Marcar que el alert está activo

    let userResponded = false;

    const alert = await this.alertController.create({
      header: '¿Emergencia médica?',
      message: 'Se detectó una caída. ¿Deseas llamar a servicios de salud?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            userResponded = true;
            this.isAlertActive = false; // Liberar el estado del alert
            console.log('El usuario seleccionó NO');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            userResponded = true;
            this.isAlertActive = false; // Liberar el estado del alert
            console.log('El usuario seleccionó SÍ');
            this.callNumber
            .callNumber('0000000000', true)
            .then(() => console.log('Llamada exitosa a 911'))
              .catch((err) => console.error('Error al intentar llamar:', err));
          },
        },
      ],
    });

    await alert.present();

    // Esperar 10 segundos por la respuesta del usuario
    setTimeout(() => {
      if (!userResponded) {
        console.log('No hubo respuesta del usuario. Realizando llamada automática.');
        this.callNumber
          .callNumber('0000000000', true)
          .then(() => console.log('Llamada de prueba realizada con éxito.'))
          .catch((err) => console.error('Error al intentar realizar la llamada de prueba:', err));

        this.isAlertActive = false; // Liberar el estado del alert
      }
    }, 10000);
  }
}
