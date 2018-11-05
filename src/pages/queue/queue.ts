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
    SenhaAtual: null
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    if (this.navParams.get('params') != null) 
    this.parameters = this.navParams.get('params');
    else {
      var a = this.storage.get('senhaAtiva');
      this.parameters = null; // Tem que dar um jeito de igualar o storage get com o parameters
    }
  }
  
  
}
