import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RequestControlProvider } from '../../providers/request-control/request-control';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
})
export class AlarmPage {

  refereceToAlarm: String;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public requestControl: RequestControlProvider,
    private storage: Storage) {
      this.requestControl.startAlarmConfig()
        .then((res) => {
          if (this.requestControl.attendanceNumber != null)
            this.refereceToAlarm = 'attendanceNumber';
          else if (this.requestControl.time != null) 
            this.refereceToAlarm = 'time';
        });
  }

  saveAlarm() {
    this.storage.set('configAlarm', {
      attendanceNumber: this.refereceToAlarm == 'attendanceNumber' ? Number(this.requestControl.attendanceNumber).valueOf() : null,
      time: this.refereceToAlarm == 'time' ? Number(this.requestControl.time).valueOf() : null
    });
  }
}
