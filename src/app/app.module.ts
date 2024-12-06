import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalCamaraComponent } from './components/modal-camara/modal-camara.component';
import { VideoRecorderComponent } from './components/video-recorder/video-recorder.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx'; 

@NgModule({
  declarations: [
    AppComponent,
    ModalCamaraComponent,
    VideoRecorderComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    CallNumber,
    MediaCapture,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
