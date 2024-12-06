import { Injectable } from '@angular/core';
import { FCM } from '@capacitor-community/fcm';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {
    this.setupPushNotifications();
  }

  setupPushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.warn('Permisos denegados para notificaciones push.');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Token de registro:', token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error en el registro:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Notificación recibida:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Acción de notificación realizada:', notification);
    });
  }

  subscribeToTopic(topic: string) {
    FCM.subscribeTo({ topic })
      .then(() => console.log(`Suscrito al tema ${topic}`))
      .catch(err => console.error('Error al suscribirse al tema:', err));
  }
}
