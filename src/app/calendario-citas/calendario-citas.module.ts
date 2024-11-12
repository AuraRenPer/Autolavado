import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarioCitasPageRoutingModule } from './calendario-citas-routing.module';
import { CalendarioCitasPage } from './calendario-citas.page';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';  // Importa la localización en español

registerLocaleData(localeEs);  // Registra la localización en español

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioCitasPageRoutingModule
  ],
  declarations: [CalendarioCitasPage],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }  // Configura el idioma en español
  ]
})
export class CalendarioCitasPageModule {}
