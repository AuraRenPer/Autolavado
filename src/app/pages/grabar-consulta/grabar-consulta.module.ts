import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GrabarConsultaPageRoutingModule } from './grabar-consulta-routing.module';
import { GrabarConsultaPage } from './grabar-consulta.page';
import { VideoRecorderWebComponent } from '../../components/video-recorder-web/video-recorder-web.component'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrabarConsultaPageRoutingModule,
  ],
  declarations: [
    GrabarConsultaPage,
    VideoRecorderWebComponent, 
  ],
})
export class GrabarConsultaPageModule {}
