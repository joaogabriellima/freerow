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

@Injectable()
export class RequestControlProvider {
    
  apiUrl = ambiente.API_URL;
  public running = true;
  attendanceNumber: Number;
  time: Number;

  parameters = {
    MinhaSenha: null,
    Data: null,
    AverageTime: null,
    SenhaAtual: null,
    Id: null
  }

  constructor(public http: HTTP,
    public backgroundMode: BackgroundMode,
    public localNotifications: LocalNotifications,
    public storage: Storage) {
  }

  private refreshConfigData() {
    return new Promise((resolve, reject) => {
      this.storage.get('configAlarm')
        .then(data => {
          this.attendanceNumber = data.attendanceNumber;
          this.time = data.time;
          resolve();
        })
        .catch(err => {
          console.log(err);
          reject();
        });
    });
  }

  start(callback) {
    this.request()
      .then(data => {
        callback(data);
        this.refreshData(callback);
      });
  }

  backgroundRequest(){
    this.backgroundMode.enable();
    this.backgroundMode.on("activate").subscribe(() => {
        this.refreshData((res) => {});
    });
  }

  refreshData(callback) {
    Observable
      .interval(5000)
      .takeWhile(a => {
        return this.running;
      })
      .do(a => this.request().then(callback))
      .subscribe();
  }

  request() {
    return new Promise((resolve, reject) => {
      this.refreshConfigData().then((result) => {
        this.http.get(this.apiUrl + '/attendance/getCurrentNumber.php', {}, {}).then(success => {
          const res = JSON.parse(success.data);

          const minhaSenha = Number(this.parameters.MinhaSenha);

          if (res.averageWaitTime != null && minhaSenha >= res.currentNumber)
            this.parameters.AverageTime = this.convertDate(res.averageWaitTime) * (minhaSenha - res.currentNumber);

          this.parameters.SenhaAtual = res.currentNumber;

          console.log(res.currentNumber);
          console.log(this.attendanceNumber);
          console.log(minhaSenha);

          if ((this.time != null && false) ||
            (this.attendanceNumber!= null && (res.currentNumber + this.attendanceNumber) >= minhaSenha)) {
            this.localNotifications.schedule({
              text: 'Sua Senha: ' +  this.parameters.MinhaSenha + ' - Senha Atual: ' + res.currentNumber + ' - Previsão de Atendimento: ' + this.parameters.AverageTime,
              led: 'FFFFFF',
              sound: null,
              vibrate: true,
              id: 1
            });
          }

          resolve(this.parameters);
        }).catch(error => {
          alert('Ocorreu um erro, por favor contate o administrador!');
          this.running = false;
        });
      });
    });
  }

  convertDate(param) {
    var average = ((param / 1000) / 60);
    return Math.round(average);
  }
}