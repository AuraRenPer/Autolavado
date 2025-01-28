import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarioServiciosPageRoutingModule } from './calendario-servicios-routing.module';
import { CalendarioServiciosPage } from './calendario-servicios.page';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';  // Importa la localización en español

registerLocaleData(localeEs);  // Registra la localización en español

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioServiciosPageRoutingModule
  ],
  declarations: [CalendarioServiciosPage],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }  // Configura el idioma en español
  ]
})
export class CalendarioServiciosPageModule {}
