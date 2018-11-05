import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { QRScanner } from '@ionic-native/qr-scanner';
import { HTTP } from '@ionic-native/http';
import { IonicStorageModule } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QueuePage } from '../pages/queue/queue';
import { GetNumberPage } from '../pages/getnumber/getnumber';
import { StatisticsPage } from '../pages/statistics/statistics';

@NgModule({
  declarations: [
    MyApp,
    GetNumberPage,
    QueuePage,
    StatisticsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetNumberPage,
    QueuePage,
    StatisticsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
