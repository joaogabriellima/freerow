import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-getnumber',
  templateUrl: 'getnumber.html'
})
export class GetNumberPage {
  
  constructor(public navCtrl: NavController,
    public qrScan: QRScanner,
    public http: HTTP) {
      
    }
    
    messageFromAliens: any;
    
    scanTheCode() {
      this.qrScan.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScan.scan().subscribe((text: string) => {
            //this.messageFromAliens = text;
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

    sendRequest() {
      this.http.post('https://api.backendless.com/C9A4EC82-7BD5-F666-FF0E-384A8AC8A400/52A14E7E-9615-DD76-FFAC-3C4C75CC5800/services/ServiceRequestService/add/777', {}, {})
      .then(data => { 
        var result = JSON.parse(data.data.ServiceRequest);
        this.messageFromAliens = result;
      }).catch((error) => {
        this.messageFromAliens = error;
      });
    }
    
  }
  