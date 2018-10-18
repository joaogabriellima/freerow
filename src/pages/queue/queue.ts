import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html'
})
export class QueuePage {
  public myNumber: any = null;
  public currentNumber: any = null;
  public averageTime: any = null;

  constructor(public navCtrl: NavController) {
    this.myNumber = 80;
    this.currentNumber = 73;
    this.averageTime = 30;
  }

}
