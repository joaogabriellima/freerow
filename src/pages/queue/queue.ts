import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html'
})
export class QueuePage {

  parameters = {
    MinhaSenha: null,
    Data: null,
    AverageTime: null,
    SenhaAtual: null,
    Id: null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
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
  }


}
