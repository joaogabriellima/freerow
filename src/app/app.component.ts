import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { QueuePage } from '../pages/queue/queue';
import { HTTP } from '@ionic-native/http';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, public http: HTTP) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.VerifyStorage();
    });
  }

  VerifyStorage() {
    var local = this.storage;

    local.get('senhaAtiva')
      .then(data => {
        if (data != null) {
          this.VerifyServiceRequest(data)
            .then(res => {
              if (res) {
                this.rootPage = QueuePage;
              }
              else {
                local.set('senhaAtiva', null);
                this.rootPage = TabsPage;
              }
            })
            .catch(err => {
              local.set('senhaAtiva', null);
              this.rootPage = TabsPage;
            });
        }
        else {
          local.set('senhaAtiva', null);
          this.rootPage = TabsPage;
        }
      });
  }

  VerifyServiceRequest(data) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.get(('http://localhost:3000/servicerequest/' + data.Id), {}, {})
        .then(item => {
          if (item != null && item.data != '' && item.data.status != 2) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log(err);
          resolve(false);
        })
    });
  }
}
