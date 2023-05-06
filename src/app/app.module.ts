import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppTitleService } from './core/services/app-title.service';
import { AppUpdateService } from './core/services/app-update.service';
import { PushNotificationService } from './core/services/push-notification.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RippleModule } from 'primeng/ripple';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './core/services/loading.service';
import { LayoutModule } from './layout/layout.module';
import { AuthService } from './core/services/auth.service';

initializeApp(environment.FirebaseConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    RippleModule,
    HttpClientModule,
    ToastModule,
    InputSwitchModule,
    GoogleMapsModule,
    LayoutModule,
    ProgressSpinnerModule
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // })
  ],
  providers: [
    Title, 
    AppTitleService, 
    // AppUpdateService, 
    PushNotificationService, 
    DeviceDetectorService,
    MessageService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    AuthService,
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
