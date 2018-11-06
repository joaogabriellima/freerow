import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { updateLocale } from 'moment';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsPage {
  
  apiUrl = 'http://localhost:3000/analytics/current/1';
  
  constructor(public navCtrl: NavController, public http: HTTP) {
    
  }
  
  ionViewWillEnter() {
    this.http.get(this.apiUrl, {}, {}).then(success => {
      
    }).catch(error => {
         
    });
  } 
  
}
