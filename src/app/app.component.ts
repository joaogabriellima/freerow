import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { QueuePage } from '../pages/queue/queue';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.VerifyStorage();
    });
  }
  
  VerifyStorage() {
    var local = this.storage;
    
    if(local.get('senhaAtiva') != null) {
      // Dar request usando os parâmetros e ver se esta ativo
      // Se estiver ativo a root é a Queue
      // Se não estiver a root é a Tabs mesmo e zera o storage
      // local.set('senhaAtiva', null); -> Isso zera o storage, se tiver dúvida ve na doc

      this.rootPage = QueuePage;
    }
    else {
      this.rootPage = TabsPage;
    }
  }
}
