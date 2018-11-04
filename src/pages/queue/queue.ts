import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    
  }
  
  ionViewWillEnter() {
    setTimeout(() => {
      this.parameters = this.navParams.get('params');
    }, 100);
  }
  
}
