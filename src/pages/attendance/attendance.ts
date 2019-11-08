import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { RequestControlProvider } from '../../providers/request-control/request-control';

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html'
})
export class AttendancePage {

  private rating: Number;

  constructor(public navCtrl: NavController,
    public requestControl: RequestControlProvider, 
    events: Events) {
    events.subscribe('star-rating:changed', (starRating) => {
      this.rating = starRating;
    });
  }

  submeter() {
    this.requestControl.rate(this.rating)
    .then((res) => {
      this.navCtrl.goToRoot({});
    });
  }
}
