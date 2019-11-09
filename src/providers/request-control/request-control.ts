import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HTTP } from '@ionic-native/http';
import { ambiente } from '../../config/config';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeWhile';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App } from 'ionic-angular';

enum Status {
  Waiting = 'Waiting',
  InAttendance = 'InAttendance',
  Done = 'Done',
  Lost = 'Lost',
  Error = 'Error'
}

@Injectable()
export class RequestControlProvider {
    
  apiUrl = ambiente.API_URL;

  attendanceNumber: number;
  time: number;
  public status: Status;

  parameters = {
    MinhaSenha: null,
    Data: null,
    AverageTime: null,
    SenhaAtual: null,
    Id: null,
    AttendentName: null
  }

  constructor(public http: HTTP,
    public backgroundMode: BackgroundMode,
    public localNotifications: LocalNotifications,
    public storage: Storage,
    public app: App) {
  }

  startAlarmConfig() {
    return new Promise((resolve, reject) => {
      this.storage.get('configAlarm')
          .then((res) => {
            this.attendanceNumber = res.attendanceNumber;
            this.time = res.time;
            resolve();
          })
          .catch((res) => {
            this.attendanceNumber = 5;
            this.time = 10;
            resolve();
          });
    });
  }

  getParamenter() {
    return new Promise<any>((resolve, reject) => {
      if (this.parameters.Id == null) {
        this.storage.get('senhaAtiva')
        .then(data => {
          if (data != null) {
            this.parameters = data;
          }
          resolve(this.parameters);
        });
      } else {
        resolve(this.parameters);
      }
    });
  }

  setParameters(data) {
    var result = JSON.parse(data.data);
    var average = ((result.Analytics.averageWaitTime) / 60);
    this.parameters.MinhaSenha = result.Attendance.queue_number;
    this.parameters.SenhaAtual = result.Analytics.currentNumber;
    this.parameters.AverageTime = Math.round(average);
    this.parameters.Id = result.Attendance.id;

    this.storage.set('senhaAtiva', this.parameters);
  }

  start() {
    this.backgroundMode.enable();
    this.status = Status.Waiting;
    this.request()
      .then(data => {
        this.refreshData();
      });
  }

  refreshData() {
    Observable
      .interval(5000)
      .takeWhile(a => {
        return this.status == Status.Waiting || this.status == Status.InAttendance;
      })
      .do(a => {
        if (this.status == Status.Waiting)
          this.request()
        else
          this.validateStatus();
      })
      .subscribe();
  }

  request() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/attendance/getCurrentNumber.php', {}, {}).then(success => {
        this.processRequest(success);

        resolve(this.parameters);
      }).catch(error => {
        alert('Ocorreu um erro, por favor contate o administrador!');
        this.status = Status.Error;
      });
    });
  }

  validateStatus() {
    return new Promise((resolve, reject) => {
      this.getAttendanceStatus(this.parameters.Id)
        .then((res) => {
          if (res.full_name != null)
            this.parameters.AttendentName = res.full_name;

          if (res.status == 1) {
            this.app.getActiveNav().push('GetNumberPage');
            this.status = Status.Lost;
            this.clear();
          } else if (res.status == 2){
            if(!this.app.getActiveNavs()[0]._views.some((value) => value.component.name == 'AttendancePage')) {
              this.app.getActiveNavs()[0].push('attendance');//setRoot
            }
          } else if (res.status == 3) {
            if(!this.app.getActiveNavs()[0]._views.some((value) => value.component.name == 'AttendancePage')) {
              this.app.getActiveNavs()[0].push('attendance');//setRoot
            }
            this.status = Status.Done;
          }

          resolve();
        })
    });
  }

  private processRequest(data) {
    const res = JSON.parse(data.data);
    const minhaSenha = Number(this.parameters.MinhaSenha).valueOf();
    let averageTime = 0;

    if (minhaSenha <= res.currentNumber) {
      this.validateStatus();
      this.status = Status.InAttendance;
      this.backgroundMode.disable();
    } else {
      if (res.averageWaitTime != null && minhaSenha >= res.currentNumber)
        averageTime = this.convertDate(res.averageWaitTime) * (minhaSenha - res.currentNumber);

      this.alertChanges(averageTime, res.currentNumber, minhaSenha);

      this.parameters.AverageTime = averageTime;
      this.parameters.SenhaAtual = res.currentNumber;
    }
  }

  private alertChanges(averageTime: number, currentNumber: number, minhaSenha: number) {
    if ((this.time != null 
          && this.parameters.AverageTime != averageTime 
          && this.time >= averageTime)
      || (this.attendanceNumber!= null 
          && this.parameters.SenhaAtual != currentNumber 
          && (currentNumber + this.attendanceNumber) >= minhaSenha)) {
      this.localNotifications.schedule({
        text: 'Senha Atual: ' + currentNumber + ' - Previsão de Atendimento: ' + averageTime + ' minutos',
        summary: 'Aviso de senha!',
        title: 'Sua Senha: ' + this.parameters.MinhaSenha,
        led: { color: '#FFFFFF', on: 1000, off: 500 },
        sound: null,
        vibrate: true,
        lockscreen: true,
        id: 1
      });
    }
  }

  convertDate(param) {
    var average = (param / 60);
    return Math.round(average);
  }

  verifyAttendance(id) {
    return new Promise<Status>((resolve, reject) => {
      this.http.get((this.apiUrl + '/attendance/getStatus.php?id=' + id), {}, {})
        .then(item => {
          const res = item != null ? JSON.parse(item.data) : null;

          if(res == null || res == '' || res.status == null) {
            this.clear();
            this.status = Status.Lost;
          } else if (res.status == 1)
            this.status = Status.Waiting;
          else if (res.status == 2)
            this.status = Status.InAttendance;
          else if (res.status == 3 && res.rate == null)
            this.status = Status.Done;
          else {
            this.clear();
            this.status = Status.Lost;
          }

          resolve(this.status);
        })
        .catch((err) => {
          console.log(err);
          this.clear();
          resolve(Status.Lost);
        })
    });
  }

  getAttendanceStatus(id) {
    return new Promise<any>((resolve, reject) => {
      this.http.get((this.apiUrl + '/attendance/getStatus.php?id=' + id), {}, {})
        .then(item => {
          const res = item != null ? JSON.parse(item.data) : null;
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject();
        })
    });
  }

  rate(rating) {
    return new Promise((resolve, reject) => {
      this.http.post((this.apiUrl + '/attendance/rate.php'), { id: this.parameters.Id, rating: rating}, {})
        .then((res) => {
          this.clear();
          this.status = null;
          resolve();
        })
        .catch((res) => {
          console.log(res);
          resolve();
        });
    });
  }

  private clear(){
    this.storage.remove('senhaAtiva');
    this.parameters = {
      MinhaSenha: null,
      Data: null,
      AverageTime: null,
      SenhaAtual: null,
      Id: null,
      AttendentName: null
    };
  }
}