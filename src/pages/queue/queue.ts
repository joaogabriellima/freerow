import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { ambiente } from '../../config/config';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html'
})
export class QueuePage {

  apiUrl = ambiente.API_URL;
  running = true;

  parameters = {
    MinhaSenha: null,
    Data: null,
    AverageTime: null,
    SenhaAtual: null,
    Id: null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public http: HTTP) {
    if (this.navParams.get('params') != null)
      this.parameters = this.navParams.get('params');
    else {
      this.storage.get('senhaAtiva')
        .then(data => {
          this.parameters = data;
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.request()
      .then(data => this.refreshData());
  }

  ionViewWillLeave() {
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
      this.http.get(this.apiUrl + '/analytics/1', {}, {}).then(success => {
        const res = JSON.parse(success.data);

        if (res.averageWaitTime != null && this.parameters.MinhaSenha >= res.currentNumber)
          this.parameters.AverageTime = this.ConvertDate(res.averageWaitTime) * (this.parameters.MinhaSenha - res.currentNumber);

        this.parameters.SenhaAtual = res.currentNumber;

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
