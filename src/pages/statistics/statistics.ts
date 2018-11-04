import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { updateLocale } from 'moment';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsPage {
  
  apiUrl = 'https://api.backendless.com/4F616520-43F6-638E-FFB5-888331026C00/E3B73BC7-4304-8C41-FFFD-449A527EFF00/services/AnalyticsService/analytics/current/777';
  
  constructor(public navCtrl: NavController, public http: HTTP) {
    
  }
  
  ionViewWillEnter() {
    this.http.get(this.apiUrl, {}, {}).then(success => {
      
      
    }).catch(error => {
         
    });
  }
  
}
