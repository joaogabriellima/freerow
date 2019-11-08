import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
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
    public http: HTTP,
    public requestControl: RequestControlProvider) {
    this.requestControl.start();
  }

  ionViewWillEnter() {
    this.requestControl.refreshData();
  }
}
