import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { ambiente } from '../../config/config';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsPage {

  apiUrl = ambiente.API_URL;

  running = true;

  parameters = {
    AverageTime: null
  };

  constructor(public navCtrl: NavController, public http: HTTP) {
    this.request();
  }

  ionViewWillLeave(){
    this.running = false;
  }

  ionViewWillEnter() {
    this.running = true;
    this.refreshData();
  }

  refreshData() {
    Observable
      .interval(5000)
      .takeWhile(a => {
        return this.running;
      })
      .do(a => this.request())
      .subscribe();
  }

  request() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/analytics/current/1', {}, {}).then(success => {
        const res = JSON.parse(success.data);

        if (res.averageWaitTime != null)
          this.parameters.AverageTime = this.ConvertDate(res.averageWaitTime);

        resolve();
      }).catch(error => {
        alert('Ocorreu um erro, por favor contate o administrador!');
      });
    });
  }

  ConvertDate(param) {
    var average = ((param / 1000) / 60);
    return Math.round(average);
  }
}
