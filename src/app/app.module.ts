import { RequestControlProvider } from './../providers/request-control/request-control';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { QRScanner } from '@ionic-native/qr-scanner';
import { HTTP } from '@ionic-native/http';
import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QueuePage } from '../pages/queue/queue';
import { GetNumberPage } from '../pages/getnumber/getnumber';
import { StatisticsPage } from '../pages/statistics/statistics';
import { AlarmPage } from '../pages/alarm/alarm';

import { StarRatingModule } from 'ionic3-star-rating';
import { AttendancePage } from '../pages/attendance/attendance';

@NgModule({
  declarations: [
    MyApp,
    GetNumberPage,
    QueuePage,
    StatisticsPage,
    TabsPage,
    AlarmPage,
    AttendancePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        {component: AttendancePage, name:'attendance'}
      ]
    }),
    IonicStorageModule.forRoot(),
    StarRatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetNumberPage,
    QueuePage,
    StatisticsPage,
    TabsPage,
    AlarmPage,
    AttendancePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    HTTP,
    BackgroundMode,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RequestControlProvider
  ]
})
export class AppModule {}
