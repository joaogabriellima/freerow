import { Component, ViewChild } from '@angular/core';

import { GetNumberPage } from '../getnumber/getnumber';
import { StatisticsPage } from '../statistics/statistics';
import { AlarmPage } from '../alarm/alarm';
import { RequestControlProvider } from '../../providers/request-control/request-control';
import { Tab, Tabs, Platform } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('tabContent') tabs: Tabs;

  tab1Root = GetNumberPage;
  tab2Root = AlarmPage;
  tab3Root = StatisticsPage;
  constructor(public requestControl: RequestControlProvider, public platform: Platform) {
    this.platform.registerBackButtonAction(() => {
      return false;
    });
  }

  ionViewDidEnter() {
    this.tabs.getByIndex(0).enabled = false;
  }

  changeTab() {
    console.log(this.tabs.getSelected().index);
    if (this.tabs.getSelected().index == 0)
      this.tabs.getByIndex(0).enabled = false;
    else
      this.tabs.getByIndex(0).enabled = true;
  }
}
