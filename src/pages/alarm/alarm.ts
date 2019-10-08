import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestControlProvider } from '../../providers/request-control/request-control';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
})
export class AlarmPage {

  refereceToAlarm: String;
  attendanceNumber: Number;
  time: Number;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public requestControl: RequestControlProvider,
    private storage: Storage) {
      this.storage.get('configAlarm')
        .then((res) => {
          this.attendanceNumber = res.attendanceNumber;
          this.time = res.time;

          if (this.attendanceNumber != null)
            this.refereceToAlarm = 'attendanceNumber';
          else if (this.time != null) 
            this.refereceToAlarm = 'time';
        })
        .catch((res) => {
          this.attendanceNumber = 5;
          this.time = 10;
        });
  }

  saveAlarm() {
    console.log(this.attendanceNumber);
    this.storage.set('configAlarm', {
      attendanceNumber: this.refereceToAlarm == 'attendanceNumber' ? Number(this.attendanceNumber) : null,
      time: this.refereceToAlarm == 'time' ? Number(this.time) : null
    });
  }
}
