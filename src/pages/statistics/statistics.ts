import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { updateLocale } from 'moment';
import { HTTP } from '@ionic-native/http';
import { ambiente } from '../../config/config';
import moment from 'moment';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsPage {

  apiUrl = ambiente.API_URL;
  paramsToUse = {
    AverageWaitTime: null,
    averageWaitConverted: null,
    CurrentNumber: null,
  };

  constructor(public navCtrl: NavController, public http: HTTP) {

  }

  ionViewWillEnter() {
    this.http.get(this.apiUrl + '/analytics/current/1', {}, {}).then(success => {
       this.paramsToUse = JSON.parse(success.data);

      if (this.paramsToUse.AverageWaitTime != null)
        this.paramsToUse.averageWaitConverted = this.ConvertDate(this.paramsToUse.AverageWaitTime);
      else
        this.paramsToUse.averageWaitConverted = 0;


    }).catch(error => {
      alert('Ocorreu um erro, por favor contate o administrador!');
    });
  }

  ConvertDate(param) {
    var average = ((param / 1000) / 60);
    return Math.round(average);
  }
}
