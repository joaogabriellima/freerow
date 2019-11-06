import { Component, ViewChild } from '@angular/core';
import { NavController, CardTitle } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { ambiente } from '../../config/config';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeWhile';

import { Chart } from 'chart.js';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsPage {

  @ViewChild('barCanvas') barCanvas;

  barChart: any;

  apiUrl = ambiente.API_URL;
  explained = 'O tempo demonstrado é apenas uma estimativa com base no tempo dos atendimentos diários!';

  running = true;

  parameters = {
    AverageTime: null,
    AverageRequests: []
  };

  constructor(public navCtrl: NavController, public http: HTTP) {
    this.request()
      .then(data => {
        this.generateGraphic();
      });
  }

  ionViewWillLeave() {
    this.running = false;
  }

  ionViewWillEnter() {
    this.running = true;
    this.refreshData();
  }

  refreshData() {
    Observable
      .interval(5000)
      .takeWhile(a => {
        return this.running;
      })
      .do(a => this.request()
                .then(res => {
                  this.updataGraphic();
                }))
      .subscribe();
  }

  request() {
    return new Promise((resolve, reject) => {
      const dayOfWeek = new Date().getDay() + 1;
      this.http.get(this.apiUrl + ('/attendance/getAttendancesByDay.php?dayOfWeek=' + dayOfWeek), {}, {}).then(success => {
        const res = JSON.parse(success.data);

        if (res.averageWaitTime != null)
          this.parameters.AverageTime = this.convertDate(res.averageWaitTime);

        this.parameters.AverageRequests = res.averageByHours;

        resolve();
      }).catch(error => {
        alert('Ocorreu um erro, por favor contate o administrador!');
        this.running = false;
      });
    });
  }

  convertDate(param) {
    const average = (param / 60);
    return Math.round(average);
  }

  updataGraphic() {
    this.parameters.AverageRequests.forEach((item, index) => {
      this.barChart.data.datasets[0].data[index] = item.porcentage;
    });

    this.barChart.update();
  }

  generateGraphic() {
    const averageRequests = this.parameters.AverageRequests;
    const chartActions = {
      beforeUpdate: function (chart) {
        const backgroundColor = [];

        averageRequests.forEach(item => {
          backgroundColor.push(new Date().getHours() == Number.parseInt(item.hour) ? 'rgba(255, 99, 132, 0.8)' : 'rgba(255, 99, 132, 0.2)');
        });

        chart.config.data.datasets[0].backgroundColor = backgroundColor;
      }
    };

    Chart.pluginService.register(chartActions);

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.parameters.AverageRequests.map(item => item.hour),
        datasets: [{
          data: this.parameters.AverageRequests.map(item => item.porcentage),
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 0.5
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              display: false,
              max: 1
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].yLabel > 0.125 ? 'Bem Movimentado' : 'Pouco Movimentado';
            },
            label: function (tooltipItems){
              return '';
            }
          },
          displayColors: false,
          titleSpacing: 0
        }
      }

    });
  }
}
