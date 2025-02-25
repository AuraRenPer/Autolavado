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

// Firebase imports
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

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
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, // ✅ Proveer JWT Options
    JwtHelperService, // ✅ Agregar JwtHelperService como proveedor
    provideAuth(() => getAuth()), // ✅ Mantener Auth
    provideFirestore(() => getFirestore()) // ✅ Mantener Firestore
],
  bootstrap: [AppComponent],
})
export class AppModule {}
