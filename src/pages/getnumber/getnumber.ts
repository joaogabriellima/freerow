import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';
import { HTTP } from '@ionic-native/http';

import moment from 'moment';
import { StatisticsPage } from '../statistics/statistics';
import { QueuePage } from '../queue/queue';
import { Storage } from '@ionic/storage';
import { ambiente } from '../../config/config';

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

  apiUrl = ambiente.API_URL;

  messageFromAliens: any;
  parameters = {
    Id: null,
    MinhaSenha: null,
    Data: null,
    AverageTime: null,
    SenhaAtual: null
  }

  ionViewWillEnter(){
    this.VerifyStorage();
  }

  //Test
  generateCode() {
    this.sendRequest(this.apiUrl + '/servicerequest/add/1');
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
        var dateToConvert = new Date(result.ServiceRequest.createDate);
        var average = (((result.Analytics.averageWaitTime) / 1000) / 60);
        this.parameters.Data = moment(dateToConvert, 'ddd MMM yyyy HH:mm').format('DD/MM/YYYY HH:mm');
        this.parameters.MinhaSenha = result.ServiceRequest.code;
        this.parameters.SenhaAtual = result.Analytics.currentNumber;
        this.parameters.AverageTime = Math.round(average);
        this.parameters.Id = result.ServiceRequest._id;

        this.storage.set('senhaAtiva', this.parameters);
        console.log(this.parameters);
        this.navCtrl.push(QueuePage, { 'params': this.parameters });
      }).catch((error) => {
        this.messageFromAliens = error;
        console.log(error);
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
                this.navCtrl.push(QueuePage);
              }
            })
            .catch(err => {
              local.set('senhaAtiva', null);
            });
        }
      });
  }

  VerifyServiceRequest(data) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.get((this.apiUrl + '/servicerequest/' + data.Id), {}, {})
        .then(item => {
          const res = item != null ? JSON.parse(item.data) : null
          if (res != null && res != '' && res.status != 2) {
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
