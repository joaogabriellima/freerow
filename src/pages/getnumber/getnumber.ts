import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';
import { HTTP } from '@ionic-native/http';

import moment from 'moment';
import { StatisticsPage } from '../statistics/statistics';
import { QueuePage } from '../queue/queue';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-getnumber',
  templateUrl: 'getnumber.html'
})
export class GetNumberPage {
  
  constructor(public navCtrl: NavController,
    public qrScan: QRScanner,
    public http: HTTP,
    private storage: Storage) {
      
    }
    
    messageFromAliens: any;
    parameters = {
      MinhaSenha: null,
      Data: null,
      AverageTime: null,
      SenhaAtual: null
    }
    
    scanTheCode() {
      this.qrScan.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScan.scan().subscribe((text: string) => {
            this.sendRequest(text);
            this.qrScan.hide();
            scanSub.unsubscribe();
            window.document.querySelector('ion-app').classList.remove('transparentBody');
          });      
          
          this.qrScan.show();
          window.document.querySelector('ion-app').classList.add('transparentBody');
        } else if (status.denied) {
          
        } else {
          
        }
      }).catch((e: any) => {
        console.log('Error is', e);
      })
    }
    
    sendRequest(link) {
      this.http.post(link, {}, {})
      .then(data => { 
        var result = JSON.parse(data.data);
        var resultConverted = JSON.parse(result.ServiceRequest);
        var dateToConvert = new Date(resultConverted.created);
        var average = (((result.Analytics.averageWaitTime)/1000)/60);
        this.parameters.Data = moment(dateToConvert, 'ddd MMM yyyy HH:mm').format('DD/MM/YYYY HH:mm');
        this.parameters.MinhaSenha = resultConverted.code;
        this.parameters.SenhaAtual = result.Analytics.currentNumber;
        this.parameters.AverageTime = Math.round(average);
        
        this.storage.set('senhaAtiva', this.parameters);
        
        this.navCtrl.push(QueuePage, { 'params' : this.parameters });
      }).catch((error) => {
        this.messageFromAliens = error;
      });
    }
    
  }
  