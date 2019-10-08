import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { ambiente } from '../../config/config';

import { RequestControlProvider } from '../../providers/request-control/request-control';

@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html'
})
export class QueuePage {

  apiUrl = ambiente.API_URL;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage, 
    public http: HTTP,
    public requestControl: RequestControlProvider) {
    if (this.navParams.get('params') != null)
      this.requestControl.parameters = this.navParams.get('params');
    else {
      this.storage.get('senhaAtiva')
        .then(data => {
          this.requestControl.parameters = data;
        })
        .catch(err => {
          console.log(err);
        });
    }

    this.requestControl.start((res) => {});
  }

  ionViewWillLeave() {
    this.requestControl.running = false;
  }

  ionViewWillEnter() {
    this.requestControl.running = true;
    this.requestControl.refreshData((res) => {});
  }
}
