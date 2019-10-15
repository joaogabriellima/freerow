import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { HTTP } from '@ionic-native/http';

import { QueuePage } from '../queue/queue';
import { ambiente } from '../../config/config';
import { RequestControlProvider } from '../../providers/request-control/request-control';

@Component({
  selector: 'page-getnumber',
  templateUrl: 'getnumber.html'
})
export class GetNumberPage {

  constructor(public navCtrl: NavController,
    public qrScan: QRScanner,
    public http: HTTP,
    private requestContol: RequestControlProvider) {
  }

  apiUrl = ambiente.API_URL;
  messageFromAliens: any;

  ionViewWillEnter() {
    this.verifyStorage();
  }

  //Test
  generateCode() {
    this.sendRequest(this.apiUrl + '/attendance/create.php');
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
        this.requestContol.setParameters(data);
        this.navCtrl.push(QueuePage);
      }).catch((error) => {
        this.messageFromAliens = error;
        console.log(error);
      });
  }

  verifyStorage() {
    this.requestContol.getParamenter()
      .then(data => {
        if(data.Id != null) {
          this.requestContol.verifyAttendance(data.Id)
            .then(res => {
              if (res == 'Waiting')
                this.navCtrl.push(QueuePage);
              else if(res == 'InAttendance' || res == 'Done')
                this.requestContol.validateStatus()
                  .then((res) => this.requestContol.refreshData());
            });
        }
      });
  }
}
