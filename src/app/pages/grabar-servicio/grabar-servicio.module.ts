import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GrabarServicioPageRoutingModule } from './grabar-servicio-routing.module';
import { GrabarServicioPage } from './grabar-servicio.page';
import { VideoRecorderWebComponent } from '../../components/video-recorder-web/video-recorder-web.component'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrabarServicioPageRoutingModule,
  ],
  declarations: [
    GrabarServicioPage,
    VideoRecorderWebComponent, 
  ],
})
export class GrabarServicioPageModule {}
